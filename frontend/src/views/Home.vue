<template>
  <div class="home">
    <div class="information-container">
      <img src="../assets/HomepagePicture.jpg" >
      <h2>Make learning fun!</h2>
      <p>Welcome to learn for fun, a website made for children looking for a more fun way to learn online!</p>
      <h2>For teachers:</h2>
      <p>An easy way to setup quizzes for your pupils</p>
      <h2>For parents:</h2>
      <p>Overview over your kids latest quiz results</p>
    </div>

    <div class="forms-container" v-if="!loggedIn">
      <form id="log-in" v-on:submit="$emit('login', username, password)">
        <h2>Log in </h2>
        <label>Username: </label> <input v-model="username" type="text" required="required"> <br>
        <label>Password: </label> <input v-model="password" type="password" required="required"> <br>
        <button>Submit</button>
      </form>

      <form id="sign-up" >
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
  name: 'Home.vue',
  data: function () {
    return {
      username: "",
      password: "",
    }
  },
  props: {
    loggedIn: [String, Object, Boolean]
  }
}
</script>


<style scoped>

h2 {
 margin-top: 5px;
}
.home {
  display: flex;
  justify-content: center;
  max-width: 100%;
  grid-template-columns: 50% 50%;
  padding: 1% 5%;
  gap: 15px;
}

img {
  width: 100%;
}

.information-container {
  width: 100%;
  background-color: white;
  border-radius: 20px;
  padding: 1%;
}

.forms-container {
  width: 100%;
  background-color: white;
  border-radius: 20px;
  padding: 1%;
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