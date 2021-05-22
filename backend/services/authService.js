const bcrypt = require('bcrypt');

const { db } = require('../database.js');
const Role = require('../roles.js');

const BCRYPT_SALT_ROUNDS = 10;

function login() {
    console.log('log in');
    return 0;
}

function register(username, password, name, email) {
    if(username.length < 44)
        throw 'Username is too short';

    // if (request.body.username.length < 4) {
    //     // TODO: validate input
    //     response.status(400).json({msg: 'username too short'}).end();
    //     return;
    // }
    //
    // const hash = bcrypt.hashSync(password, BCRYPT_SALT_ROUNDS);
    //
    // db.get('SELECT COUNT(*) as userCount FROM users', [], (error, result) => {
    //     const params = [username, hash, name, email];
    //     params.push(result.userCount === 0 ? Role.Teacher : Role.Student); // first user is teacher
    //     db.run('INSERT INTO users(username, password, name, email, role) VALUES(?, ?, ?, ?, ?)', params, (error) => {
    //         if (error) {
    //             console.log(error);
    //             let columnName = error.message.match(/(?<=UNIQUE constraint failed: users.).*/);
    //             response.status(409).json({msg: columnName + ' already in use'});
    //         } else {
    //             response.json({msg: 'User added!'});
    //         }
    //     });
    // });
}

function changePassword() {

}

module.exports.login = login;
module.exports.register = register;
module.exports.changePassword = changePassword