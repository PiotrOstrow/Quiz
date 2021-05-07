const api = {
    logIn(username, password) {
        const details = {
            'username': username,
            'password': password
        }

        return this.postForm('/login', details);
    },
    register(username, name,  password, email) {
        const details = {
            'username': username,
            'password': password,
            'name': name,
            'email': email
        }

        return this.postForm('/register', details);
    },
    getQuiz(id) {
        return this.get('/quiz/' + id);
    },
    checkLogin() {
        return this.get('/');
    },
    logout() {
        return this.get('/logout');
    },
    get(url) {
        return fetch('http://' + window.location.hostname + ':3000' + url, {
            method: 'GET',
            credentials: 'include'
        });
    },
    postForm(url, form) {
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
}

export default api;