const api = {
    async logIn(username, password) {
        const details = {
            'username': username,
            'password': password
        }

        let formBody = [];
        for (let property in details) {
            let encodedKey = encodeURIComponent(property);
            let encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");

        return await this.request('/login', formBody);
    },
    async register(username, name,  password, email) {
        const details = {
            'username': username,
            'password': password,
            'name': name,
            'email': email
        }

        let formBody = [];
        for (let property in details) {
            let encodedKey = encodeURIComponent(property);
            let encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");

        return await this.request('/register', formBody);
    },
    async request(url, body) {
        return await fetch('http://' + window.location.hostname + ':3000' + url, {
            method: 'POST',
            credentials: 'include',
            body: body,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    },
    async checkLogin() {
        return await fetch('http://' + window.location.hostname + ':3000/', {
            method: 'GET',
            credentials: 'include'
        });
    },
    async logout() {
        return await fetch('http://' + window.location.hostname + ':3000/logout', {
            method: 'GET',
            credentials: 'include'
        });
    }
}

export default api;