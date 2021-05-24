const express = require('express');

const { db } = require('../database.js');
const { checkAuthentication } = require('../middleware/auth.js');
const Role = require('../roles.js');

const router = express.Router();

router.delete('/quiz/:id', checkAuthentication(Role.Teacher), (request, response) => {
    // regular function instead of an arrow function to access this.changes
    db.run('DELETE FROM quizzes WHERE ID = ?', [request.params.id], function (error) {
        if (error) {
            console.log(error);
            response.status(500).end();
            return;
        }

        // this.changes is the number of rows deleted
        if (this.changes === 0) {
            response.status(404).end();
            return;
        }

        db.run('DELETE FROM quiz_questions WHERE quizID = ?', [request.params.id], () => {
            // 204 no content on success
            response.status(204).end();
        })
    });
});

router.post('/quiz', checkAuthentication(Role.Teacher), (request, response) => {
    // needs to be a regular function instead of an arrow function in order for this.lastID to work
    db.run('INSERT INTO quizzes(title, categoryID) VALUES(?, ?)', [request.body.title, request.body.categoryID], function (error) {
        if (error) {
            console.log(error);
            response.status(500).end();
            return;
        }

        insertQuestions(this.lastID, request.body.questions, error => {
            if (error) {
                console.log(error);
                response.status(500).end();
            } else {
                response.status(200).end();
            }
        });
    });
})

router.put('/quiz', checkAuthentication(Role.Teacher), (request, response) => {
    db.run('UPDATE quizzes SET title = ?, categoryID = ? WHERE ID = ?', [request.body.title, request.body.categoryID, request.body.ID], error => {
        if(error) {
            console.log(error);
            response.status(500).end();
            return;
        }
        // TODO: handle errors or case when quiz does not exist?

        db.run('DELETE FROM quiz_questions WHERE quizID = ?', [request.body.ID], error => {
            if(error)
                console.log(error);

            insertQuestions(request.body.ID, request.body.questions, error => {
                if (error) {
                    console.log(error);
                    response.status(500).end();
                } else {
                    response.status(200).end();
                }
            });
        })
    });
});

// endpoint to get all the quiz details for a teacher to be able to edit it
router.get('/quizdetails/:id', checkAuthentication(Role.Teacher), (request, response) => {
    let data = {
        ID: '',
        title: '',
        categoryID: '',
        questions: []
    };

    db.get('SELECT * FROM quizzes WHERE ID = ?', [request.params.id], (error, result) => {
        if(error) {
            console.log(error);
            response.status(500).end();
            return;
        }

        if(result == null) {
            response.status(404).end();
            return;
        }

        data.ID = result.ID;
        data.title = result.title;
        data.categoryID = result.categoryID;

        db.all('SELECT * FROM quiz_questions WHERE quizID = ?', [request.params.id], (error, result) => {
            data.questions = result;
            response.json(data).end();
        });
    });
});

// endpoint for the overview of a single student
router.get('/student-overview/:id', checkAuthentication(Role.Teacher), (request, response) => {
    let data = {
        student: '',
        quizResults: ''
    }

    db.get('SELECT ID, username, name, email FROM users where ID = ?', [request.params.id], (error, result) => {
        data.student = result;

        let sql = `SELECT quizID, title, max(score) as maxScore, 
                    (SELECT COUNT(*) FROM quiz_questions WHERE quiz_questions.quizID = quiz_results.quizID) as question_count, 
                    COUNT(quiz_results.ID) as attempts
                FROM quiz_results
                inner join quizzes on quizID = quizzes.ID 
                where userID = ?
                group by quizID, title`;
        db.all(sql, [request.params.id], (error, result) => {
            if (error) {
                console.log(error);
            }
            if (result == null) {
                response.status(400).end();
                return;
            }

            data.quizResults = result;
            response.json(data);
        })
    });
});

router.get('/teacher/quiz-overview/:id', checkAuthentication(Role.Teacher), (request, response) => {
    let data = {
        quiz: {},
        students: {}
    };

    db.get('SELECT ID, title, (SELECT COUNT(*) from quiz_questions WHERE quiz_questions.quizID = quizzes.ID) as numberOfQuestions FROM quizzes WHERE ID = ?'
        , [request.params.id], (error, result) => {
            if (error) {
                console.log(error);
                response.status(500).end();
                return;
            }

            data.quiz = result;

            let sql =
                `SELECT name, MAX(quiz_results.score) as 'maxScore', COUNT(quiz_results.ID) as 'attempts'
                 FROM users
                          INNER JOIN quiz_results ON users.ID = quiz_results.userID
                 WHERE quiz_results.quiziD = ?
                 GROUP BY users.ID, users.name`;

            db.all(sql, [request.params.id], (error, result) => {
                if (error) {
                    console.log(error);
                    response.status(500).end();
                    return;
                }

                data.students = result;
                response.json(data);
            });
        });
});

router.post('/category', checkAuthentication(Role.Teacher), (request, response) => {
    // capitalize category name for each word
    let categoryName = '';

    for(const word of request.body.categoryName.trim().split(' ')) {
        let trimmed = word.trim();
        if(trimmed.length > 0) {
            categoryName += trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase() + ' ';
        }
    }

    // category as UNIQUE in database, no need to check
    db.run('INSERT INTO quiz_categories(categoryName) VALUES(?)', [categoryName.trim()], (error) => {
        if(error) {
            response.status(409).end();
        } else {
            response.status(200).end();
        }
    });
});

function insertQuestions(quizID, questions, callback = (error) => {}) {
    // TODO: validate input

    // construct a query to insert all of the questions at once
    let placeholders = questions.map(() => '(?, ?, ?, ?, ?, ?)').join(', ');
    let query = 'INSERT INTO quiz_questions(quizID, question, correct_answer, answer1, answer2, answer3) VALUES ' + placeholders;

    // create a 2 dimensional array of arrays of parameters
    let params = [];
    for (const q of questions)
        params.push([quizID, q.question, q.correctAnswer, q.incorrectAnswers[0], q.incorrectAnswers[1], q.incorrectAnswers[2]]);

    // flatten the array to one dimension because sqlite
    let flatParams = [];
    params.forEach((arr) => arr.forEach((item) => flatParams.push(item)));

    db.run(query, flatParams, callback);
}

module.exports = router;
