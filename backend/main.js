const express = require("express");
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const expressSession = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const db = require('./database.js');

const BCRYPT_SALT_ROUNDS = 10;
const HTTP_PORT = 3000;

passport.use(new LocalStrategy(
    function(username, password, done) {
        db.get('SELECT * FROM users  WHERE username = ?', [username], (error, result) => {
            if(error || result == null) {
                return done(null, false);
            }
            bcrypt.compare(password, result.password, function(err, bcryptResult) {
                if(bcryptResult) {
                    return done(null, { ID: result.ID ,username: username, email: result.email, name: result.name });
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
app.use(bodyParser.urlencoded({ extended: false }));
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

const checkAuthentication = function(request, response, next){
    if(request.isAuthenticated()) {
        next();
    } else {
        response.status(401).json({msg:'Not authenticated'});
    }
}

app.post('/login', passport.authenticate('local'), (request, response) => {
    // If this function gets called, authentication was successful.
    // `request.user` contains the authenticated user.
    db.all('SELECT * FROM quizzes', [], (error, result) => {
        if(error)
            console.log(error);
        response.json({ user: request.user, quizList: result });
    });
});

// This endpoint is used to check login status when vue app is loaded/mounted and get any data required for the app
app.get('/', checkAuthentication, (request, response) => {
    db.all('SELECT * FROM quizzes', [], (error, result) => {
        if(error)
            console.log(error);
        response.json({ user: request.user, quizList: result });
    });
});

app.get('/quiz/:id', (request, response) => {
    let data = {};
    db.get('SELECT * FROM quizzes WHERE ID = ?', [request.params.id], (error, result) => {
        if(error) {
            console.log(error);
            response.status(500).end();
            return;
        }

        if(result == null){
            response.status(404).end();
            return;
        }

        data = result;
        db.all('SELECT ID, question, answer1, answer2, answer3, answer4 FROM quiz_questions WHERE quizID = ?', [request.params.id], (error, result) => {
            data.questions = result;
            response.json(data);
        });
    })
});

app.get('/logout', checkAuthentication, (request, response) => {
    request.logout();
    response.status(200).json({msg:'Logged out'});
});

app.post('/register', (request, response) => {
    if(request.body.username.length < 4) {
        // TODO: validate input
        response.status(400).end();
        return;
    }
    bcrypt.hash(request.body.password, BCRYPT_SALT_ROUNDS, function(err, hash) {
        const params = [request.body.username, hash, request.body.name, request.body.email, 1];
        db.run('INSERT INTO users(username, password, name, email, role) VALUES(?, ?, ?, ?, ?)', params, (error) => {
            if(error) {
                console.log(error);
                let columnName = error.message.match(/(?<=UNIQUE constraint failed: users.).*/);
                response.status(409).json({msg:columnName + ' already in use'});
            } else {
                response.json({msg:'User added!'});
            }
        });
    });
});

app.post('/submit', checkAuthentication, (request, response) => {
    // console.log('Submitted answers:');
    // console.log(request.body.answers);
    db.all('SELECT ID, correct_answer FROM quiz_questions WHERE quizID = ?', [request.body.id], (error, result) => {
        if(error)
            console.log(error);

        if(result == null) {
            response.status(400).end();
            return;
        }

        // console.log('correct answers:');
        // console.log(result)

        let correctAnswerCount = 0;

        for(let i = 0; i < result.length; i++) {
            console.log(result[i].ID + ': ' + result[i].correct_answer);
            let questionID = result[i].ID;
            let givenAnswer = request.body.answers[questionID];
            let correctAnswer = result[i].correct_answer;

            if(givenAnswer === correctAnswer)
                correctAnswerCount++;
        }

        // console.log('Correct answers: ' + correctAnswerCount + '/' + result.length);

        let parameters = [request.user.ID, request.body.id, correctAnswerCount];
        db.run('INSERT INTO quiz_results (userID, quizID, score) VALUES(?, ?, ?)', parameters, (error, result) => {
            if(error)
                console.log(error);
        });
    });
});