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
            bcrypt.compare(password, result.password, function(err, result) {
                if(result) {
                    return done(null, { username: username });
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
    response.json({msg: 'Logged in!'});
});

// This endpoint is used to check login status when vue app is loaded/mounted and get any data required for the app
app.get('/', checkAuthentication, (request, response) => {
    response.json({user: {username: request.user.username}})
});

app.get('/logout', checkAuthentication, (request, response) => {
    request.logout();
    response.status(200).json({msg:'Logged out'});
});

app.post('/register', (request, response) => {
    bcrypt.hash(request.body.password, BCRYPT_SALT_ROUNDS, function(err, hash) {
        const params = [request.body.username, hash, request.body.role];
        db.run('INSERT INTO users(username, password, role) VALUES(?, ?, ?)', params, (error, result) => {
            if(error) {
                response.json({msg:error});
            } else {
                response.json({msg:'User added!'});
            }
        });
    });
});



