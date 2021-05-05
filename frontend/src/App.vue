<template>
  <div id="app">

    <header>
      <img id="logo" alt="Learn4Fun" src="./assets/logo.jpg">
      <div id="header-container">
        <h1>Learn for fun!</h1>
      </div>
    </header>

    <nav>
      <ul class="nav-links">
        <li>
          <router-link to="/">Home</router-link>
        </li>
        <li>
          <router-link to="/profile">Profile</router-link>
        </li>
        <li>
          <router-link to="/results">Results</router-link>
        </li>
        <li>
          <router-link to="/quiz">Quiz</router-link>
        </li>
      </ul>
    </nav>
    <div class="main">
      <router-view/>
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

footer ul {
  list-style: none;
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

.main {
  grid-area: main;
}

</style>
