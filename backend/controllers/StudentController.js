const express = require('express');

const {db} = require('../database.js');
const {checkAuthentication} = require('../middleware/auth.js');
const Role = require('../roles.js');
const Util = require('../util.js');

const router = express.Router();

/**
 * Puts together questions from database results
 */
function composeQuestions(result) {
    let questions = [];

    // answers assumed to be ordered by having the blank strings at the end of the array, which is how the frontend
    // sends them and which backend should verify
    for (const row of result) {
        let question = {
            ID: row.ID,
            question: row.question
        };

        let answers = [row.answer1, row.answer2, row.answer3, row.answer4].filter((item) => item != null && item.length > 0);

        if(answers.length > 1){
            Util.shuffle(answers);
            question.answers = answers;
        }

        questions.push(question);
    }

    return questions;
}

router.get('/quiz/:id', checkAuthentication(Role.Student), (request, response) => {
    db.get('SELECT * FROM quizzes WHERE ID = ? AND isLiveQuiz = 0', [request.params.id], (error, result) => {
        if (error) {
            console.log(error);
            response.status(500).end();
            return;
        }

        if (result == null) {
            response.status(404).end();
            return;
        }

        let data = {
            ID: result.ID,
            title: result.title,
            questions: []
        };

        db.all('SELECT ID, question, answer1, answer2, answer3, correct_answer as answer4 FROM quiz_questions WHERE quizID = ?', [request.params.id], (error, result) => {
            if (error)
                console.log(error);

            data.questions = composeQuestions(result);

            response.json(data);
        });
    })
});

router.post('/submit-repetition-quiz', checkAuthentication(Role.Student), (request,response) =>{
    db.all(`SELECT quiz_questions.ID, quiz_questions.correct_answer as 'correct_answer' FROM quiz_questions
    INNER JOIN failed_questions ON quiz_questions.ID = failed_questions.questionID
    WHERE failed_questions.userID = ?`, [request.user.ID], (error, result) => {

        if (error)
            console.log(error);

        let correctAnswerCount = 0;
        let answers = [];

        for (let i = 0; i < result.length; i++) {
            let questionID = result[i].ID;
            let givenAnswer = request.body.answers[questionID];
            let correctAnswer = result[i].correct_answer;
            let isCorrect = givenAnswer === correctAnswer;

            answers.push({questionID: questionID, correct: isCorrect});

            if (isCorrect) {
                correctAnswerCount++;
                db.run('DELETE FROM failed_questions WHERE userID = ? AND questionID = ?', [request.user.ID, questionID], err => {});
            }
        }
        response.json({score: correctAnswerCount, answers: answers});
    });
});

router.post('/submit', checkAuthentication(Role.Student), (request, response) => {
    db.all('SELECT ID, correct_answer FROM quiz_questions WHERE quizID = ?', [request.body.id], (error, result) => {
        if (error)
            console.log(error);

        if (result == null) {
            response.status(400).end();
            return;
        }

        let correctAnswerCount = 0;
        let answers = [];

        for (let i = 0; i < result.length; i++) {
            let questionID = result[i].ID;
            let givenAnswer = request.body.answers[questionID];
            let correctAnswer = result[i].correct_answer;
            let isCorrect = givenAnswer === correctAnswer;

            answers.push({questionID: questionID, correct: isCorrect});

            if (isCorrect) {
                correctAnswerCount++;
            } else {
                db.run('INSERT INTO failed_questions(userID, questionID) VALUES(?, ?)', [request.user.ID, questionID], (error) => {});
            }
        }

        let parameters = [request.user.ID, request.body.id, correctAnswerCount];
        db.run('INSERT INTO quiz_results (userID, quizID, score) VALUES(?, ?, ?)', parameters, (error, result) => {
            if (error)
                console.log(error);

            response.json({score: correctAnswerCount, answers: answers});
        });
    });
});

// endpoint for getting the repetition quiz
router.get('/repetition-quiz', checkAuthentication(Role.Student), (request, response) => {
    let sql = `SELECT quiz_questions.ID,
                      quiz_questions.question,
                      quiz_questions.answer1,
                      quiz_questions.answer2,
                      quiz_questions.answer3,
                      quiz_questions.correct_answer as 'answer4'
               FROM quiz_questions
                        INNER JOIN failed_questions ON quiz_questions.ID = failed_questions.questionID
               WHERE failed_questions.userID = ?`;

    let data = {
        ID: -1,
        title: 'Repetition Quiz',
        questions: []
    };

    db.all(sql, [request.user.ID], (error, result) => {
        if (error)
            console.log(error);

        data.questions = composeQuestions(result);

        Util.shuffle(data.questions);

        response.json(data);
    })
});

// endpoint to get an overview of questions for the repetition quiz
router.get('/failed-questions', checkAuthentication(Role.Student), (request, response) => {
    let sql = `SELECT quizzes.title,
                      COUNT(*)                                                                       AS incorrectAnswerCount,
                      (SELECT COUNT(*) FROM quiz_questions WHERE quiz_questions.quizID = quizzes.ID) as question_count
               FROM failed_questions
                        INNER JOIN quiz_questions ON failed_questions.questionID = quiz_questions.ID
                        INNER JOIN quizzes ON quiz_questions.quizID = quizzes.ID
               WHERE userID = ?
               GROUP BY quizzes.ID, quizzes.title;`;

    db.all(sql, [request.user.ID], (error, result) => {

        // handling of error
        if (error) {
            console.log(error);
        }
        // handling of result when result is null
        if (result == null) {
            response.status(400).end();
            return;
        }
        // handling of result
        response.json(result);
    });
});

// endpoint for the result page
router.get('/results', checkAuthentication(Role.Student), (request, response) => {
    let sql = `
        SELECT quizID,
               title,
               MAX(score)                                          as maxScore,
               (SELECT COUNT(*)
                FROM quiz_questions
                WHERE quiz_questions.quizID = quiz_results.quizID) as question_count,
               COUNT(quiz_results.ID)                              as attempts
        FROM quiz_results
                 INNER JOIN quizzes on quizID = quizzes.ID
        WHERE userID = ?
        GROUP BY quizID, title`;


    db.all(sql, [request.user.ID], (error, result) => {

        // handling of error
        if (error) {
            console.log(error);
        }
        // handling of result when result is null
        if (result == null) {
            response.status(400).end();
            return;
        }
        // handling of result
        response.json(result);
    });
});

// endpoint for scoreboard
router.get('/all-results/:id', checkAuthentication(Role.Student), (request, response) => {
    let data = {
        quiz: {},
        students: []
    };

    let sql = `SELECT ID,
                      title,
                      (SELECT COUNT(*) from quiz_questions WHERE quiz_questions.quizID = quizzes.ID) as numberOfQuestions
               FROM quizzes
               WHERE ID = ?`;

    db.get(sql, [request.params.id], (error, result) => {
        if (error) {
            console.log(error);
            response.status(500).end();
            return;
        }
        data.quiz = result;

        let sql =
            `SELECT name, MAX(quiz_results.score) as 'maxScore'
             FROM users
                      INNER JOIN quiz_results ON users.ID = quiz_results.userID
             WHERE quiz_results.quiziD = ?
             GROUP BY users.ID, users.name
             ORDER BY MAX(quiz_results.score) DESC`;

        db.all(sql, [request.params.id], (error, result) => {
            if (error) {
                console.log(error);
                response.status(500).end();
                return;
            }

            data.students = result;
            response.json(data);
        })
    });
});

router.get('/student-home-results-for-each-quiz/', checkAuthentication(Role.Student), (request, response) => {
    let sql = `
        SELECT quizzes.ID,
               title,
               MAX(score)                                          as maxScore,
               (SELECT COUNT(*)
                FROM quiz_questions
                WHERE quiz_questions.quizID = quizzes.ID) as question_count,
                quiz_categories.ID as categoryID,
                quiz_categories.categoryName
        FROM quizzes
                 LEFT JOIN quiz_results on quizzes.ID = quiz_results.quizID AND userID = ?
                 INNER JOIN quiz_categories ON quizzes.categoryID = quiz_categories.ID
        WHERE isLiveQuiz = 0 
        GROUP BY quizID, title`;

    db.all(sql,[request.user.ID], (error, result) => {
        if (error) {
            console.log(error);
        }

        response.json(result)
    });
});


module.exports = router;
