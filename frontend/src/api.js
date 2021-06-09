
export default {
    postForm,
    postJson,
    logIn,
    register,
    getQuiz,
    getResults,
    checkLogin,
    logout,
    get,
    deleteRequest,
    putJson
}

const hostname = '185.181.10.135';

function deleteRequest(url) {
    return fetch('http://' + hostname + ':3000' + url, {
        method: 'DELETE',
        credentials: 'include',
    });
}

function putJson(url, data) {
    return fetch('http://' + hostname + ':3000' + url, {
        method: 'PUT',
        credentials: 'include',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

function postForm(url, form) {
    let formBody = [];
    for (let property in form) {
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(form[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }

    formBody = formBody.join("&");

    return fetch('http://' + hostname + ':3000' + url, {
        method: 'POST',
        credentials: 'include',
        body: formBody,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}

function postJson(url, data) {
    return fetch('http://' + hostname + ':3000' + url, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

function logIn(username, password) {
    const details = {
        'username': username,
        'password': password
    }

    return this.postForm('/login', details);
}

function register(username, name,  password, email) {
    const details = {
        'username': username,
        'password': password,
        'name': name,
        'email': email
    }

    return this.postForm('/register', details);
}

function getQuiz(id) {
    return this.get('/quiz/' + id);
}

function getResults() {
    return this.get('/results');
}

function checkLogin() {
    return this.get('/');
}

function logout() {
    return this.get('/logout');
}

function get(url) {
    return fetch('http://' + hostname + ':3000' + url, {
        method: 'GET',
        credentials: 'include'
    });
}
