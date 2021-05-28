const WebSocket = require('ws');
const Role = require('./roles.js');
const { db } = require('./database.js');

class Quiz {
    constructor(quizID, teacher) {
        this.teacher = teacher
        this.participants = [];
        this.quiz = {};
        this.currentQuestionID = 0;
    }

    start() {

    }
}

// class Participant {
//     constructor(user) {
//         this.ID = user.ID;
//         this.score = 0;
//         this.name = user.name;
//     }
// }

// const liveQuizzes = new Map();
let currentQuiz = undefined;

function startQuiz(quizID) {
    console.log('Starting quiz id ' + quizID);

    let data = {
        ID: '',
        title: '',
        questions: []
    };

    db.get('SELECT * FROM quizzes WHERE ID = ?', [request.params.id], (error, result) => {
        if(error) {
            console.log(error);
            return;
        }

        if(result == null) {
            return;
        }

        data.ID = result.ID;
        data.title = result.title;

        db.all('SELECT * FROM quiz_questions WHERE quizID = ?', [request.params.id], (error, result) => {
            data.questions = result;
            currentQuiz = new Quiz(quizID, data);
            currentQuiz.start();
        });
    });
}

module.exports = function(httpServer, sessionParser) {
    const webSocketServer = new WebSocket.Server({
        server: httpServer
    });

    webSocketServer.on('connection', function connection(ws, request) {
        sessionParser(request, {}, function () {

            let user = {
                ID:     request.session.passport.user.ID,
                name:   request.session.passport.user.name,
                role:   request.session.passport.user.role,
                score:  0
            };

            ws.on('message', function incoming(message) {
                message = JSON.parse(message);
                console.log('Action is ' + message.action);
                if(user.role === Role.Teacher) {
                    switch (message.action) {
                        case 'start': startQuiz(message.quizID); break;
                    }
                } else {

                }
            });
        })
    });

    return webSocketServer;
}