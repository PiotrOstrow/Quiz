<template>
  <div id="app">

    <header>
      <router-link :to="user ? user.role === 'student' ? '/student/home' : '/teacher/home' : '/'">
        <img id="logo" alt="Learn4Fun" src="./assets/logo.jpg">
        <div id="header-container">
          <h1>Learn for fun!</h1>
        </div>
      </router-link>
    </header>

    <nav v-if="loggedIn">
      <HamburgerMenu id="hamburger-container" v-on:hamburgerClick="onBurgerClick" ref="hamburgerMenu"/>
      <ul class="nav-links" ref="navUl">
        <li v-if="user.role === 'student'">
          <router-link to="/student/home">Home</router-link>
        </li>
        <li v-if="user.role === 'student'">
          <router-link to="/student/profile">Profile</router-link>
        </li>
        <li v-if="user.role === 'student'">
          <router-link to="/student/results">Results</router-link>
        </li>
        <li v-if="user.role === 'student'">
          <router-link to="/student/repetition">ReQuiz</router-link>
        </li>
        <li v-if="user.role === 'student'">
          <router-link to="/student/live">Live Quiz</router-link>
        </li>

        <li v-if="user.role === 'teacher'">
          <router-link to="/teacher/home">Home</router-link>
        </li>
        <li v-if="user.role === 'teacher'">
          <router-link to="/teacher/create">Create Quiz</router-link>
        </li>
        <li v-if="user.role === 'teacher'">
          <router-link to="/teacher/live">Live Quiz</router-link>
        </li>

        <li>
          <a @click="logout">Log out</a>
        </li>
      </ul>

    </nav>
    <nav v-else id="empty_nav"></nav>
    <div class="hidden-mobile-nav-container" ref="mobileNavContainer">
      <ul ref="navUl">
        <li v-if="user.role === 'student'">
          <router-link to="/student/home" v-on:click.native="hideBurgerMenu">Home</router-link>
        </li>
        <li v-if="user.role === 'student'">
          <router-link to="/student/profile" v-on:click.native="hideBurgerMenu">Profile</router-link>
        </li>
        <li v-if="user.role === 'student'">
          <router-link to="/student/results" v-on:click.native="hideBurgerMenu">Results</router-link>
        </li>
        <li v-if="user.role === 'student'">
          <router-link to="/student/repetition" v-on:click.native="hideBurgerMenu">ReQuiz</router-link>
        </li>
        <li v-if="user.role === 'student'">
          <router-link to="/student/live" v-on:click.native="hideBurgerMenu">Live Quiz</router-link>
        </li>

        <li v-if="user.role === 'teacher'">
          <router-link to="/teacher/home" v-on:click.native="hideBurgerMenu">Home</router-link>
        </li>
        <li v-if="user.role === 'teacher'">
          <router-link to="/teacher/create" v-on:click.native="hideBurgerMenu">Create Quiz</router-link>
        </li>
        <li v-if="user.role === 'teacher'">
          <router-link to="/teacher/live" v-on:click.native="hideBurgerMenu">Live Quiz</router-link>
        </li>

        <li>
          <a @click="logout">Log out</a>
        </li>
      </ul>
    </div>
    <div class="main">
      <router-view
          :loggedIn="loggedIn"
          :user="user"
          :quizList="quizList"
          :quizCategories="quizCategories"
          :users="users"
          :scoreData="singleQuizScore"
          v-on:login="login"
          v-on:register="register"
          v-on:showConfirmModal="showConfirmModal"
          v-on:showInputModal="showInputModal"
          v-on:showSingleResult="showSingleResult"
          v-on:deleteQuiz="deleteQuiz"
          />
    </div>

    <confirm-modal ref="confirmModal"></confirm-modal>
    <input-modal ref="inputModal"></input-modal>

    <footer>
      <ul class="footer-info">
        <li>
          <p>Copyright © Learn for Fun!</p>
        </li>
      </ul>
    </footer>
  </div>
</template>

<script>

import api from './api.js';
import Role from './roles.js'
import fetchIntercept from 'fetch-intercept';

import ConfirmModal from "@/components/ConfirmModal";
import InputModal from "@/components/InputModal";
import HamburgerMenu from "@/components/HamburgerMenu";

export default {
  components: {HamburgerMenu, ConfirmModal, InputModal},
  data: function() {
    return {
      loggedIn: false,
      user: {
        id: '',
        username: '',
        name: '',
        email: '',
        role: ''
      },
      quizList: [],
      quizCategories: [],
      users: [],
      singleQuizScore: {}
    }
  },
  methods: {
    register(username, name, password, email) {
      api.register(username, name,  password, email)
        .then(response => {
          if(response.status === 200) {
            this.$refs.confirmModal.show({
              title: 'Account created!',
              message: 'Log in with your username and password.',
              okButton: 'OK',
            })
          } else {
            response.json().then(json => {
              console.log(json);
              this.$refs.confirmModal.show({
                title: 'You have entered wrong details when registering a new user.',
                message: 'Please try again, be wary of duplicate usernames',
                okButton: 'OK I understand',
              })
            });
          }
        });
    },
    onLoggedIn(json) {
      // This method is called when the user logs in, or when the page is mounted and the fetch to check login status
      // and get data returns 200. Changes the route if necessary

      this.user = json.user;
      this.quizList = json.quizList;
      this.quizCategories = json.categories;
      this.users = json.users;

      const currentRoute = this.$router.currentRoute;
      const { authorize } = currentRoute.meta

      if(currentRoute.fullPath === '/' || (authorize.length > 0 && !authorize.includes(this.user.role))) {
        if (this.user.role === Role.Student) {
          this.$router.push('/student/home');
        } else {
          this.$router.push('/teacher/home');
        }
      }
    },
    login(username, password) {
      api.logIn(username, password).then(response => {
          this.loggedIn = response.status === 200;

          if(this.loggedIn) {
            response.json().then(json => this.onLoggedIn(json));

          } else if(response.status === 401) {
            this.$refs.confirmModal.show({
              title: 'Could not log in.',
              message: 'Incorrect username or password, please try again',
              okButton: 'OK I understand',
            })
          } else {
            this.$refs.confirmModal.show({
              title: 'Could not log in.',
              message: 'Please try again',
              okButton: 'OK I understand',
            })
          }
      });
    },
    logout() {
      this.loggedIn = false;
      this.$router.push('/');
      api.logout();
      this.hideBurgerMenu();
    },
    showSingleResult(data) {
      this.singleQuizScore = data;
      this.$router.push('/student/single-result');
    },
    beforeEach(to, from, next) {
      // redirect to home page (path === '/') if not logged in
      if(!this.loggedIn) {
        if(to.fullPath === '/')
          return next();
        else
          return next('/');
      }

      // otherwise if logged in, going to home is blocked ...
      if(/*this.loggedIn && */to.fullPath === '/')
        return next(false);

      // ... as well as any other path that doesn't allow the role equivalent of the users
      const { authorize } = to.meta;
      if (authorize) {
        if(authorize.length > 0 && !authorize.includes(this.user.role))
          return next(false);
      }

      next();
    },
    showConfirmModal(options) {
      this.$refs.confirmModal.show(options);
    },
    showInputModal(options) {
      this.$refs.inputModal.show(options);
    },
    deleteQuiz(quizID) {
      api.deleteRequest('/quiz/' + quizID)
        .then(response => {
          if(response.status === 204) { // on success should return 204 no content
            // remove quiz from quiz list
            for(let i = 0; i < this.quizList.length; i++) {
              if(this.quizList[i].ID === quizID){
                this.quizList.splice(i, 1);
                break;
              }
            }
          }
        });
    },
    onBurgerClick(isOpen) {
      if(isOpen)
        this.showBurgerMenu();
      else
        this.hideBurgerMenu();
    },
    showBurgerMenu() {
      this.$refs.mobileNavContainer.classList.add('hidden-mobile-nav-container-open');
      this.$refs.hamburgerMenu.setOpen();
    },
    hideBurgerMenu() {
      this.$refs.mobileNavContainer.classList.remove('hidden-mobile-nav-container-open');
      this.$refs.hamburgerMenu.setClosed();
    }
  },
  mounted: function () {
    // navigation guard, Home page (path === '/') only accessible if not logged in
    // https://router.vuejs.org/guide/advanced/navigation-guards.html#global-resolve-guards
    this.$router.beforeEach(this.beforeEach);

    // intercepts every fetch
    // if status code is 401 then session is assumed to be expired and user is returned to login page
    fetchIntercept.register({
      response: (response) => {
        if(response.status === 401) {
          this.loggedIn = false;
          if(this.$router.currentRoute.fullPath !== '/')
            this.$router.push('/');
        }
        return response;
      }
    });

    api.checkLogin().then(response => {
      this.loggedIn = response.status === 200;

      // grab json data
      if(this.loggedIn)
        response.json().then(this.onLoggedIn);
    });
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Pangolin&display=swap');

:root {
  --footer-height: 52px;
  --nav-height: 52px;
  --header-height: 65px;
}

* {
  box-sizing: border-box;
}

body {
  font-family: Pangolin, sans-serif;
  margin: 0;
  background-color: #FFF5E8;
}

input {
  font-family: Pangolin, sans-serif;
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
  padding: 0;
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
  border-radius: 6em / 7em;
  float: left;
  position: relative;
  left: 0;
  margin: 10px 10px;
  height: 45px;
  width: auto;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
  position: relative;
}

header {
  width: 100%;
  height: var(--header-height);
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
  font-size: 15px;
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
  min-height: var(--nav-height);
  position: relative;
}

#empty_nav {
  height: 30px;
}

.nav-links {
  display: none;
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

.hidden-mobile-nav-container {
  height: 0;
  display: none;
}

.hidden-mobile-nav-container ul {
  /*border: solid 1px red;*/
  margin: 0;
  background-color: #00a2e8;
  font-weight: bold;
  color: white;
  padding-left: 0;
}

.hidden-mobile-nav-container ul li {
  /*padding: 10px;*/
  width: 100%;
  text-align: center;
}

.hidden-mobile-nav-container a {
  text-decoration: none;
  color: white;
  font-size: 22px;
  display: block;
  padding: 10px;
}

.hidden-mobile-nav-container-open {
  height: max-content;
  display: block;
  transition: 1s all ease;
}

button {
  font: 400 15px Pangolin;
  background-color: rgba(0, 162, 232, 0.8);
  color: white;
  padding: 8px;
  border-style: none;
  border-radius: 2px;
  transition: transform .2s;

}

button:disabled {
  background-color: gray;
}



.main {
  grid-area: main;
  padding-bottom: var(--footer-height); /* offsets the footer */
  min-height: calc(100vh - var(--header-height) - var(--nav-height) - var(--footer-height));
  /*display: flex;*/
  /*justify-content: center;*/
  /*flex-direction: column;*/
}

.blue-table {
  margin: 25px auto;
  border-collapse: collapse;
  font-size: 0.9em;
  font-family: sans-serif;
  width: 95%;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
}

.blue-table thead tr {
  background-color: #00a2e8;
  color: #ffffff;
  text-align: left;
}

.blue-table th,
.blue-table td {
  padding: 7px;
  font-family: Pangolin, sans-serif;
  text-align: center;
  width: min-content;
}

.blue-table tbody tr {
  border-bottom: 1px solid #dddddd;
  cursor: pointer;
}

.blue-table tbody tr:nth-of-type(even) {
  background-color: #f3f3f3;
}

.blue-table tbody tr:last-of-type {
  border-bottom: 2px solid #00a2e8;
}

.blue-table tbody tr.active-row {
  font-weight: bold;
  color: #00a2e8;
}

.icon-button svg {
  width: 1em;
  height: 1em;
  display: inline-block;
  vertical-align: -.125em;
}

.icon-button {
  margin: 2px;
  color: black;
  padding: 4px;
}

.blue-table button {
  margin: 0px 2px;
}

.radio-input-container {
  margin: 10px;
}


input[type="radio"] {
  opacity: 0;
  position: fixed;
  width: 0;
}

.radio-input-container label {
  display: inline-block;
  background-color: rgba(0, 162, 232, 0.8);
  font: 400 15px Pangolin;
  color: white;
  padding: 10px 20px;
  border-radius: 2px;
  transition: transform .2s;
}

#hamburger-container {
  position: absolute;
  right: 0;
  top: 0;
}

@media screen and (min-width: 350px) and (max-width: 767px) {
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
    font-size: 20px;
  }
}

@media screen and (min-width:768px) {
  :root {
    --header-height: 120px;
  }

  .blue-table tbody tr:hover {
    background-color: #afcce8;
    color: black;
  }

  .radio-input-container label:hover {
    background-color: rgba(0, 162, 232, 1);
    transform: scale(1.05);
  }

  .blue-table tr button:hover {
    /*background-color: white;*/
    color: white;
  }

  button:hover {
    cursor: pointer;
    background-color: rgba(0, 162, 232, 1);
    transform: scale(1.05);

  }

  button:disabled:hover {
    background-color:grey;
    transform: none;
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
    font-size: 36px;
  }

  #logo {
    border-radius: 6em / 7em;
    float: left;
    position: relative;
    left: 0;
    margin: 10px 10px;
    height: 100px;
    width: auto;
  }

  header {
    width: 100%;
    height: 120px;
    grid-area: header;
    margin: 0 auto;
    background-color: #F29544;
    position: relative;
  }

  .nav-links {
    display: flex;
    padding-left: 0;
    list-style: none;
  }

  .blue-table {
    margin: 25px auto;
    border-collapse: collapse;
    font-size: 0.9em;
    font-family: sans-serif;
    width: 500px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  }

  .blue-table th,
  .blue-table td {
    padding: 12px 15px;
    font-family: Pangolin, sans-serif;
    text-align: center;
  }

  #hamburger-container {
    display: none;
  }
}

</style>
