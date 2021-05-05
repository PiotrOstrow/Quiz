<template>
  <div class="home">
    <div class="information-container">
      <h2>Make learning fun!</h2>
      <p>Welcome to learn for fun, a website made for children looking for a more fun way to learn online!</p>
      <h2>For teachers:</h2>
      <p>An easy way to setup quizzes for your pupils</p>
      <h2>For parents:</h2>
      <p>Overview over your kids latest quiz results</p>
    </div>

    <div class="log-in-container">
      <form id="log-in">
        <h2>Log in </h2>
        <label>Username: </label> <input type="text"> <br>
        <label>Password: </label> <input type="password"> <br>
        <button>Submit</button>
      </form>

      <form id="sign-up">
        <h2>Sign up</h2>
        <label>Username:</label> <input type="text"> <br>
        <label>Name: </label> <input type="text"> <br>
        <label>Password:</label> <input type="password"> <br>
        <label>E-mail:</label> <input type="email"> <br>
        <button>Submit</button>
      </form>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Home.vue'
}
</script>


<style scoped>
.home {
  display: flex;
  justify-content: center;
  max-width: 100%;
}

.information-container {
  max-width: 45%;
  background-color: white;
}

.log-in-container {
  max-width: 45%;
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
</style>