const express = require("express");
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const expressSession = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const db = require('./database.js');
const Role = require('./roles.js');
const util = require('./util.js');

const BCRYPT_SALT_ROUNDS = 10;
const HTTP_PORT = 3000;

passport.use(new LocalStrategy(
    function (username, password, done) {
        db.get('SELECT * FROM users  WHERE username = ?', [username], (error, result) => {
            if (error || result == null) {
                return done(null, false);
            }
            bcrypt.compare(password, result.password, function (err, bcryptResult) {
                if (bcryptResult) {
                    let user = {
                        ID: result.ID,
                        username: username,
                        email: result.email,
                        name: result.name,
                        role: result.role
                    };
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
        });
    }
));

// more on serialization http://www.passportjs.org/docs/configure/#sessions
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(expressSession({
    secret: 'qwerty12345',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
    origin: /.*/,
    credentials: true
}));

app.listen(HTTP_PORT, () => {
    console.log('Server running on port ' + HTTP_PORT);
});

function checkAuthentication(roles) {
    if (typeof roles === 'string')
        roles = [roles];

    return (request, response, next) => {
        if (request.isAuthenticated() && roles.includes(request.user.role)) {
            next();
        } else {
            response.status(401).json({msg: 'Not authenticated'});
        }
    }
}

function getData(request, response) {
    db.all('SELECT ID, title, (SELECT COUNT(*) FROM quiz_questions WHERE quizID = quizzes.ID) as questionCount FROM quizzes', [], (error, result) => {
        if (error)
            console.log(error);

        let data = {
            user: request.user,
            quizList: result
        };

        if(request.user.role === Role.Teacher) {
            db.all('SELECT username, name, email FROM users WHERE role = ?', [Role.Student], (error, result) => {
                data.users = result;
                response.json(data);
            });
        } else {
            response.json(data);
        }
    });
}

// If the second function gets called, authentication was successful.
// `request.user` contains the authenticated user.
app.post('/login', passport.authenticate('local'), getData);

// This endpoint is used to check login status when vue app is loaded/mounted and get any data required for the app
app.get('/', checkAuthentication([Role.Student, Role.Teacher]), getData);

app.get('/quiz/:id', checkAuthentication(Role.Student), (request, response) => {
    db.get('SELECT * FROM quizzes WHERE ID = ?', [request.params.id], (error, result) => {
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
            if(error)
                console.log(error);

            for(const row of result) {
                let answers = [row.answer1, row.answer2, row.answer3, row.answer4];
                answers = util.shuffle(answers);

                data.questions.push({
                    ID: row.ID,
                    question: row.question,
                    answers: answers
                });
            }

            response.json(data);
        });
    })
});

app.post('/quiz', checkAuthentication(Role.Teacher), (request, response) => {
    // needs to be a regular function instead of an arrow function in order for this.lastID to work
    db.run('INSERT INTO quizzes(title) VALUES(?)', [request.body.title], function(error) {
        if(error) {
            console.log(error);
            response.status(500).end();
            return;
        }

        // TODO: validate input

        // construct a query to insert all of the questions at once
        let placeholders = request.body.questions.map(() => '(?, ?, ?, ?, ?, ?)').join(', ');
        let query = 'INSERT INTO quiz_questions(quizID, question, correct_answer, answer1, answer2, answer3) VALUES ' + placeholders;

        // create a 2 dimensional array of arrays of parameters
        let params = [];
        for(const q of request.body.questions)
            params.push([this.lastID, q.question, q.correctAnswer, q.incorrectAnswers[0], q.incorrectAnswers[1], q.incorrectAnswers[2]]);

        // flatten the array to one dimension because sqlite
        let flatParams = [];
        params.forEach((arr) => arr.forEach((item) =>  flatParams.push(item)));

        db.run(query, flatParams, (error) => {
            if(error){
                console.log(error);
                response.status(500).end();
            } else {
                response.status(200).end();
            }
        });
    });
})

app.get('/logout', checkAuthentication([Role.Student, Role.Teacher]), (request, response) => {
    request.logout();
    response.status(200).json({msg: 'Logged out'});
});

app.post('/register', (request, response) => {
    if (request.body.username.length < 4) {
        // TODO: validate input
        response.status(400).json({msg:'username too short'}).end();
        return;
    }
    bcrypt.hash(request.body.password, BCRYPT_SALT_ROUNDS, function (err, hash) {
        db.get('SELECT COUNT(*) as userCount FROM users', [], (error, result) => {
            const params = [request.body.username, hash, request.body.name, request.body.email];
            params.push(result.userCount === 0 ? Role.Teacher : Role.Student); // first user is teacher
            db.run('INSERT INTO users(username, password, name, email, role) VALUES(?, ?, ?, ?, ?)', params, (error) => {
                if (error) {
                    console.log(error);
                    let columnName = error.message.match(/(?<=UNIQUE constraint failed: users.).*/);
                    response.status(409).json({msg: columnName + ' already in use'});
                } else {
                    response.json({msg: 'User added!'});
                }
            });
        });
    });
});

app.post('/submit', checkAuthentication(Role.Student), (request, response) => {
    db.all('SELECT ID, correct_answer FROM quiz_questions WHERE quizID = ?', [request.body.id], (error, result) => {
        if (error)
            console.log(error);

        if (result == null) {
            response.status(400).end();
            return;
        }

        let correctAnswerCount = 0;
        let answers = [];
        let givenAnswers = [];

        for (let i = 0; i < result.length; i++) {
            let questionID = result[i].ID;
            let givenAnswer = request.body.answers[questionID];
            let correctAnswer = result[i].correct_answer;

            givenAnswers.push(givenAnswer);

            answers[i] = givenAnswer === correctAnswer;
            if (answers[i])
                correctAnswerCount++;
        }

        let parameters = [request.user.ID, request.body.id, correctAnswerCount];
        db.run('INSERT INTO quiz_results (userID, quizID, score) VALUES(?, ?, ?)', parameters, (error, result) => {
            if (error)
                console.log(error);

            response.json({score: correctAnswerCount, answers: answers, givenAnswers: givenAnswers});
        });
    });
});

app.get('/results', checkAuthentication(Role.Student), (request, response) => {
    db.all('SELECT quizID, title, max(score) as score, (SELECT COUNT(*) FROM quiz_questions WHERE quiz_questions.quizID = quiz_results.quizID) as question_count ' +
        'FROM quiz_results inner join quizzes on quizID = quizzes.ID ' +
        'where userID = ? ' +
        'group by quizID, title', [request.user.ID], (error, result) => {

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

app.get('/teacher', checkAuthentication(Role.Teacher), (request, response) => {
    response.json({msg:'You are a teacher!'});
})
