<template>
  <div id="app">

    <header>
      <img id="logo" alt="Learn4Fun" src="./assets/logo.jpg">
      <div id="header-container">
        <h1>Learn for fun!</h1>
      </div>
    </header>

    <nav v-if="loggedIn">
      <ul class="nav-links">
        <li>
          <router-link to="/home-student">Home</router-link>
        </li>
        <li>
          <router-link to="/profile">Profile</router-link>
        </li>
        <li>
          <router-link to="/results">Results</router-link>
        </li>
        <li>
          <router-link to="/create">Create Quiz</router-link>
        </li>
        <li>
          <a @click="logout">Log out</a>
        </li>
      </ul>
    </nav>
    <nav v-else id="empty_nav"></nav>
    <div class="main">
      <router-view
          :loggedIn="loggedIn"
          :user="user"
          :quizList="quizList"
          :scoreData="singleQuizScore"
          v-on:login="login"
          v-on:register="register"
          v-on:showSingleResult="showSingleResult"
          />
    </div>

    <footer>
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
      quizList: [],
      singleQuizScore: {}
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

            response.json().then(json => {
              this.user = json.user;
              this.quizList = json.quizList;
            });

          } else if(response.status === 401) {
            alert('Wrong username and/or password')
          } else {
            alert('Unable to login');
          }
      });
    },
    logout() {
      this.loggedIn = false;
      this.$router.push('/');
      api.logout();
    },
    showSingleResult(data) {
      this.singleQuizScore = data;
      this.$router.push('/single-result');
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
          this.$router.push('/Home-student');
      } else {
        this.$router.push('/');
      }
    });
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Pangolin&display=swap');

:root {
  --footer-height: 52px;
}

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
  width: 100%;
  text-align: center;
  height: var(--footer-height);
  position: absolute;
  bottom: 0;
}

footer ul {
  /* ul element in footer had a left padding of 40px which made the text off center*/
  /* was most likely due to list style but same thing happens even with list-style: none*/
  padding: 0;
  /*list-style: none;*/
}

ul {
  list-style: none;
}

a {
  cursor: pointer;
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
  /*display: grid;*/
  /*grid-template-columns: 1fr;*/
  /*grid-template-areas: "header"*/
  /*          "nav"*/
  /*          "main"*/
  /*          "footer";*/
  min-height: 100vh;
  position: relative;
}

header {
  width: 100%;
  height: 120px;
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
  /*min-height: 2vh;*/
  height: 52px;
}

#empty_nav {
  height: 20px;
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
  background-color: rgba(0, 162, 232, 0.8);
  color: white;
  padding: 3px 6px;
  border-style: none;
  border-radius: 5px;
  transition: transform .2s;
}

button:disabled {
  background-color: gray;
}

button:disabled:hover {
  background-color:grey;
  transform: none;
}

button:hover {
  cursor: pointer;
  background-color: rgba(0, 162, 232, 1);
  transform: scale(1.05);
}

.main {
  grid-area: main;
  padding-bottom: var(--footer-height); /* offsets the footer */
}

</style>
