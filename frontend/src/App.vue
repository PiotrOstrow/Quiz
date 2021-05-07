<template>
  <div id="app">

    <header>
      <img id="logo" alt="Learn4Fun" src="./assets/logo.jpg">
      <div id="header-container">
        <h1>Learn for fun!</h1>
      </div>
    </header>

    <nav>
      <ul v-if="loggedIn" class="nav-links">
        <li>
          <router-link to="/home-student">Home</router-link>
        </li>
        <li>
          <router-link to="/profile">Profile</router-link>
        </li>
        <li>
          <router-link to="/results">Results</router-link>
        </li>
<!--        <li>-->
<!--          <router-link to="/quiz">Quiz</router-link>-->
<!--        </li>-->
        <li>
          <a @click="logout">Log out</a>
        </li>
      </ul>
    </nav>
    <div class="main">
      <router-view :loggedIn="loggedIn" :user="user" v-on:login="login" v-on:register="register" :quizList="quizList"/>
    </div>

    <footer>
      <div class="wrapper"></div>
        <ul class="footer-info">
          <li>
            <p>CopyRight © Learn for Fun!</p>
          </li>
        </ul>
    </footer>
  </div>
</template>

<script>

import api from './api.js';

export default {
  data: function() {
    return {
      loggedIn: false,
      user: {
        username: '',
        name: '',
        email: '',
        birthdate: ''
      },
      quizList: []
    }
  },
  methods: {
    register(username, name, password, email) {
      api.register(username, name,  password, email)
        .then(response => {
          if(response.status === 200) {
            alert('Account registered!');
          } else {
            response.json().then(json => alert(json.msg));
          }
        });
    },
    login(username, password) {
      api.logIn(username, password).then(response => {
          this.loggedIn = response.status === 200;
          if(this.loggedIn) {
            this.$router.push('Home-student');
          }
      });
    },
    logout() {
      this.loggedIn = false;
      this.$router.push('/');
      api.logout();
    }
  },
  mounted: function () {
    // navigation guard, can't go to Home page if logged in, or anywhere but home when not logged in
    // https://router.vuejs.org/guide/advanced/navigation-guards.html#global-resolve-guards
    this.$router.beforeEach((to, from, next) => {
      if(this.loggedIn && to.name !== 'Home')
        next();
      if(!this.loggedIn && to.name === 'Home')
        next();
    });

    api.checkLogin().then(response => {
      this.loggedIn = response.status === 200;

      if(this.loggedIn) {
        // grab json data
        response.json().then(json => {
          this.user = json.user;
          this.quizList = json.quizList;
        });

        // if the route is on login screen, change it
        if(this.$router.currentRoute.name === 'Home')
          this.$router.push('Home-student');
      } else {
        this.$router.push('/');
      }
    });
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Pangolin&display=swap');

* {
  box-sizing: border-box;
}

body {
  font-family: Pangolin, sans-serif;
  margin: 0;
  background-color: #FFF5E8;
}

footer {
  background-color: #00a2e8;
  grid-area: footer;
  position: absolute;
  bottom:0;
  width: 100%;
  text-align: center;
}

ul {
  list-style: none;
}

a {
  cursor: pointer;
}

.wrapper {
  padding-bottom: 5px;
}

.footer-info {
  font-weight: bold;
  color: white;
}

#logo {
  border-radius:50%;
  float: left;
  position: relative;
  left: 0;
  margin: 10px 10px;
  height: 100px;
  width: auto;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-areas: "header"
            "nav"
            "main"
            "footer";
}

header {
  width: 100%;
  grid-area: header;
  margin: 0 auto;
  background-color: #F29544;
  position: relative;
}

#header-container {
  height: 100%;
  width: 100%;
  color: white;
  margin: 0 auto;
  position: absolute;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

#header-container h1 {
  width: auto;
  display: inline-block;
}

nav {
  grid-area: nav;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #00a2e8;
  min-height: 2vh;
}

.nav-links {
  display: flex;
  padding-left: 0;
  list-style: none;
}

.nav-links a {
  font-weight: bold;
  color: white;
  text-decoration: none;
  padding: 10px;
}

.nav-links a:hover {
  text-decoration: underline;
}

button {
  font: 400 15px Pangolin;
  background-color: #00a2e8;
  color: white;
  padding: 3px 6px;
  border-style: none;
  border-radius: 5px;
}

button:hover {
  cursor: pointer;
  background-color: #014055;
}

.main {
  grid-area: main;
}

</style>
