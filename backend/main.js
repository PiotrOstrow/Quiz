const express = require('express');
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const expressSession = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const { db } = require('./database.js');
const liveQuizServer = require('./LiveQuizServer.js');

const authController = require('./controllers/authController.js');
const studentController = require('./controllers/studentController.js');
const teacherController = require('./controllers/teacherController.js');

const HTTP_PORT = 3000;

passport.use(new LocalStrategy(
    function (username, password, done) {
        db.get('SELECT * FROM users  WHERE username = ?', [username], (error, result) => {
            if (error || result == null) {
                return done(null, false);
            }

            if (bcrypt.compareSync(password, result.password)) {
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
    }
));

// more on serialization http://www.passportjs.org/docs/configure/#sessions
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const sessionParser = expressSession({
    secret: 'qwerty12345',
    resave: false,
    saveUninitialized: false
});
app.use(sessionParser);

app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
    origin: /.*/,
    credentials: true
}));

app.use(authController);
app.use(studentController);
app.use(teacherController);

const httpServer = app.listen(HTTP_PORT, () => {
    console.log('Server running on port ' + HTTP_PORT);
});

liveQuizServer(httpServer, sessionParser);
