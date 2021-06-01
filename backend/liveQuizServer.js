const WebSocket = require('ws');
const Role = require('./roles.js');
const { db } = require('./database.js');

class Quiz {
    constructor(quiz, teacher) {
        this.teacher = teacher
        this.quiz = quiz;
        this.participants = new Map();
        this.currentQuestionID = 0;
        this.answers = new Map();
        this.questionStartTime = 0;

        this.timeForLeaderboard = 5;
        this.timePerQuestion = 10;

        this.timeoutID = undefined;
        this.timeoutFunction = () => {
            this.timeoutID = undefined;
            this.endQuestion();
            console.log('question timeout');
        }
    }

    isStarted() {
        return this.questionStartTime !== 0;
    }

    start() {
        this.questionStartTime = Date.now();
        this.timeoutID = setTimeout(this.timeoutFunction, this.timePerQuestion * 1000);

        const data = JSON.stringify({reply: 'started'});
        this.teacher.ws.send(data);
        this.sendToAllParticipants(data);
    }

    sendToAllParticipants(data) {
        for(const participant of this.participants.entries())
            participant[1].ws.send(data);
    }

    addParticipant(user) {
        this.participants.set(user.ID, user);
        this.updateParticipants();
    }

    removeParticipant(user) {
        if(!this.isStarted()) {
            this.participants.delete(user.ID);
            this.updateParticipants();
        }
    }

    updateParticipants() {
        const data = JSON.stringify({participants: this.getParticipantList()});

        this.teacher.ws.send(data);
        this.sendToAllParticipants(data);
    }

    getParticipantList() {
        let list = [];
        for(const participant of this.participants.entries())
            list.push({name: participant[1].name});
        return list;
    }

    getLeaderboard() {
        let leaderboard = [];

        for(const participant of this.participants.entries()){
            const user = participant[1];

            leaderboard.push({
                ID: user.ID,
                name: user.name,
                score: user.score
            });
        }

        return leaderboard.sort((a, b) => b.score - a.score);
    }

    endQuestion() {
        // in case everyone answered the question, and the timeout is still going
        if(this.timeoutID) {
            clearTimeout(this.timeoutID);
            this.timeoutID = undefined;
        }

        const data = JSON.stringify({
            reply: 'leaderboard',
            leaderboard: this.getLeaderboard()
        });

        this.teacher.ws.send(data);
        this.sendToAllParticipants(data);

        setTimeout(() => {
            if(!this.isQuizOver())
                this.nextQuestion();

        }, this.timeForLeaderboard * 1000)
    }

    nextQuestion() {
        this.currentQuestionID++;
        this.questionStartTime = Date.now();

        const data = JSON.stringify({
            reply: 'next'
        });

        this.teacher.ws.send(data);
        this.sendToAllParticipants(data);

        // timeout in case not everyone answers the question in time
        this.timeoutID = setTimeout(this.timeoutFunction, this.timePerQuestion * 1000);
    }

    isQuizOver() {
        return this.currentQuestionID >= this.quiz.questions.length - 1;
    }

    answer(user, answer) {
        if(user.answeredIndex !== this.currentQuestionID) {
            user.answeredIndex = this.currentQuestionID;

            const question = this.quiz.questions[this.currentQuestionID];
            const correct = question.correct_answer === answer;

            if (correct) {
                const currentTime = Date.now();
                const timeElapsed = currentTime - this.questionStartTime;
                const timeLeft = this.timePerQuestion * 1000 - timeElapsed;

                const percent = (timeLeft / this.timePerQuestion) / 1000;
                const maxPoints = 100;

                user.score += Math.round(maxPoints * percent);
            }

            let answerCount = 0;
            for (const participant of this.participants.entries()) {
                if (participant[1].answeredIndex === this.currentQuestionID) {
                    answerCount++;
                }
            }

            user.ws.send(JSON.stringify({
                reply: 'answer',
                correct: correct
            }));

            this.teacher.ws.send(JSON.stringify({
                reply: 'answer',
                count: answerCount
            }))

            // if everyone answered
            if (answerCount === this.participants.size)
                this.endQuestion();
        }
    }
}

const liveQuizzes = new Map();

function initQuiz(user, quizID, quizCode) {
    quizCode = quizCode.toLowerCase();

    if(liveQuizzes.has(quizCode)){
        user.ws.send(JSON.stringify({ error: 'Code already in use' }));
        return;
    }

    console.log('Starting quiz id ' + quizID + ' with code ' + quizCode);

    let data = {
        ID: '',
        title: '',
        questions: []
    };

    db.get('SELECT * FROM quizzes WHERE ID = ?', [quizID], (error, result) => {
        if(error) {
            console.log(error);
            return;
        }

        if(result == null) {
            return;
        }

        data.ID = result.ID;
        data.title = result.title;

        db.all('SELECT * FROM quiz_questions WHERE quizID = ?', [quizID], (error, result) => {
            data.questions = result;

            const quiz = new Quiz(data, user);
            liveQuizzes.set(quizCode, quiz);

            user.code = quizCode;
            user.ws.send(JSON.stringify({
                reply: 'initialized',
                timePerQuestion: quiz.timePerQuestion,
                timeForLeaderboard: quiz.timeForLeaderboard
            }));
        });
    });
}

function joinQuiz(user, code) {
    code = code.toLowerCase();
    const quiz = liveQuizzes.get(code);

    if(quiz && !quiz.isStarted()) {
        quiz.addParticipant(user);
        user.code = code;

        user.ws.send(JSON.stringify({
            reply: 'joined',
            quizID: quiz.quiz.ID,
            participants: quiz.getParticipantList(),
            timePerQuestion: quiz.timePerQuestion,
            timeForLeaderboard: quiz.timeForLeaderboard
        }));
    } else {
        user.ws.send(JSON.stringify({error: 'Invalid code'}));
    }
}

function startQuiz(user, code) {
    if(liveQuizzes.has(code)) {
        const quiz = liveQuizzes.get(code);

        if (quiz.teacher.ID !== user.ID)
            return;

        quiz.start();
    }
}

function answer(user, answer) {
    if(liveQuizzes.has(user.code))
        liveQuizzes.get(user.code).answer(user, answer);
}

function cancelTeachersQuiz(user) {
    if(liveQuizzes.has(user.code)) {
        const quiz = liveQuizzes.get(user.code);

        if (quiz.teacher.ID === user.ID) {
            liveQuizzes.delete(user.code);

            quiz.sendToAllParticipants(JSON.stringify({reply:'cancelled'}));
        }
    }
}

module.exports = function(httpServer, sessionParser) {
    const webSocketServer = new WebSocket.Server({
        server: httpServer
    });

    // httpServer.on('upgrade', (req, socket, head) => {
    //     console.log('upgrade')
    // });

    webSocketServer.on('connection', function connection(ws, request) {
        sessionParser(request, {}, function () {

            let user = {ws: ws};
            if(request.session.passport) {
                user.ID = request.session.passport.user.ID;
                user.name = request.session.passport.user.name;
                user.role = request.session.passport.user.role;
                user.answeredIndex = -1;
                user.score = 0;
            }

            ws.on('message', function incoming(message) {
                message = JSON.parse(message);

                if(user.role === Role.Teacher) {
                    switch (message.action) {
                        case 'init': initQuiz(user, message.quizID, message.code); break;
                        case 'start': startQuiz(user, message.code); break;
                    }
                } else {
                    switch (message.action) {
                        case 'join': joinQuiz(user, message.code); break;
                        case 'answer': answer(user, message.answer); break;
                    }
                }
            });

            ws.on('close', function close() {
                if(user.role === Role.Teacher) {
                    cancelTeachersQuiz(user);
                } else {
                    if (user.code && liveQuizzes.has(user.code)) {
                        liveQuizzes.get(user.code).removeParticipant(user);
                    }
                }
            });
        })
    });

    return webSocketServer;
}