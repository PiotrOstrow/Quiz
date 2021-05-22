const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');

const Role = require('../roles.js');
// const authService = require('../services/authService.js');
const { db } = require('../database.js');
const { checkAuthentication } = require('../middleware/auth.js');

const BCRYPT_SALT_ROUNDS = 10;

const router = express.Router();

// If the second function gets called, authentication was successful.
// `request.user` contains the authenticated user.
router.post('/login', passport.authenticate('local'), onAuthenticated);

// This endpoint is used to check login status when vue app is loaded/mounted and get any data required for the app
router.get('/', checkAuthentication([Role.Student, Role.Teacher]), onAuthenticated);

router.get('/logout', checkAuthentication([Role.Student, Role.Teacher]), (request, response) => {
    request.logout();
    response.status(200).json({msg: 'Logged out'});
});

router.post('/register', (request, response) => {
    // try {
    //     authService.register(request.body.username, request.body.name, request.body.email);
    // } catch (e) {
    //     response.status(400).json({msg:e}).end();
    // }

    if (request.body.username.length < 4) {
        // TODO: validate input
        response.status(400).json({msg: 'username too short'}).end();
        return;
    }

    const hash = bcrypt.hashSync(request.body.password, BCRYPT_SALT_ROUNDS);

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

router.post('/change-password', checkAuthentication(Role.Student), (request, response) => {
    let data = {
        success: false,
        msg: ''
    }

    if(request.body.newPassword !== request.body.newPasswordRepeated) {
        data.msg = 'Repeated password do not match!';
        response.json(data);
        return;
    }

    db.get('SELECT password FROM users WHERE ID = ?', [request.user.ID], (error, result) => {
        if (error)
            console.log(error);

        // compare passwords
        if (!bcrypt.compareSync(request.body.currentPassword, result.password)) {
            data.msg = 'Incorrect password!';
            response.json(data);
            return;
        }

        // update password
        const newHash = bcrypt.hashSync(request.body.newPassword, BCRYPT_SALT_ROUNDS);
        db.run('UPDATE users SET password = ? WHERE ID = ?', [newHash, request.user.ID], (error) => {
            if (error) {
                console.log(error);
                data.msg = 'Server error';
            } else {
                data.success = true;
                data.msg = 'Password changed!';
            }
            response.json(data);
        });
    });
});

function onAuthenticated(request, response) {
    let data = {
        user: request.user,
        quizList: [],
        categories: []
    };

    db.serialize(() =>{
        db.all(`SELECT 
                    quizzes.ID, 
                    title, 
                    categoryID,
                    categoryName,
                    (SELECT COUNT(*) FROM quiz_questions WHERE quizID = quizzes.ID) as questionCount 
                FROM quizzes
                INNER JOIN quiz_categories ON quizzes.categoryID = quiz_categories.ID
                `, [], (error, result) => {
            if (error)
                console.log(error);

            data.quizList = result;
        });

        if (request.user.role === Role.Teacher) {
            db.all('SELECT ID, username, name, email FROM users WHERE role = ?', [Role.Student], (error, result) => {
                data.users = result;

            });
        }

        db.all('SELECT * FROM quiz_categories', [], (error, result) => {
            if(error)
                console.log(error);

            data.categories = result;
            response.json(data);
        });
    })
}

module.exports = router;
