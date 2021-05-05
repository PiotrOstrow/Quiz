const express = require("express");
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const expressSession = require('express-session');
const bodyParser = require('body-parser');
const db = require('./database.js');

const HTTP_PORT = 3000;

passport.use(new LocalStrategy(
    function(username, password, done) {
        // User.findOne({ username: username }, function (err, user) {
        //     if (err) { return done(err); }
        //     if (!user) {
        //         return done(null, false, { message: 'Incorrect username.' });
        //     }
        //     if (!user.validPassword(password)) {
        //         return done(null, false, { message: 'Incorrect password.' });
        //     }
        //     return done(null, user);
        // });
        return done(null, { username: username });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressSession({secret: 'qwerty12345'}));
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
    // `req.user` contains the authenticated user.
    response.json({msg: 'Logged in!'});
});

app.get('/', checkAuthentication, (request, response) => {
    response.json({msg:'Logged in as ' + request.user.username, userObject: request.user});
});

app.get('/logout', (request, response) => {
    request.logout();
    response.status(200).json({msg:'Logged out'});
});
