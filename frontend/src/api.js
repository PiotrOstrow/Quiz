
const api = {
    postForm,
    postJson,
    logIn,
    register,
    getQuiz,
    getResults,
    checkLogin,
    logout,
    get
}

function postForm(url, form) {
    let formBody = [];
    for (let property in form) {
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(form[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }

    formBody = formBody.join("&");

    return fetch('http://' + window.location.hostname + ':3000' + url, {
        method: 'POST',
        credentials: 'include',
        body: formBody,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}

function postJson(url, data) {
    return fetch('http://' + window.location.hostname + ':3000' + url, {
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
    return fetch('http://' + window.location.hostname + ':3000' + url, {
        method: 'GET',
        credentials: 'include'
    });
}

export default api;