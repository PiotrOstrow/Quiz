<template>
  <div id="app">
    <header>
      <img alt="Learn4Fun" src="./assets/logo.jpg">
      <h1>Learn for fun!</h1>
    </header>
    <nav>
      <ul class="nav-links">
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/profile">Profile</router-link></li>
        <li><router-link to="/results">Results</router-link></li>
        <li><router-link to="/quiz">Quiz</router-link></li>
      </ul>
    </nav>
    <router-view/>
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

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

header {
  display: flex;
  justify-content: center;
  margin: 0;
  background-color: #F29544;
}

header h1 {
  color: white;
}

nav {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #00a2e8;
  min-height: 2vh;
}

.nav-links{
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

</style>
