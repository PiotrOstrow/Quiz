<template>
  <div class="home">
    <div class="information-container">
      <img src="../assets/HomepagePicture.jpg">
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
        <table>
          <tr>
            <td><label>Username: </label></td>
            <td><input v-model="username" type="text" required="required"></td>
          </tr>
          <tr>
            <td><label>Password: </label></td>
            <td><input v-model="password" type="password" required="required"></td>
          </tr>
        </table>
        <button>Submit</button>
      </form>
      <br>
      <form id="sign-up" v-on:submit="submitRegister">
        <h2>Sign up</h2>
        <table>
          <tr>
            <td><label>Username:</label></td>
            <td><input v-model="rUsername" type="text" required="required"></td>
          </tr>
          <tr>
            <td><label>Name: </label></td>
            <td><input v-model="rName" type="text" required="required"></td>
          </tr>
          <tr>
            <td><label>Password:</label></td>
            <td><input v-model="rPassword" type="password" required="required"></td>
          </tr>
          <tr>
            <td><label>Verify Password:</label></td>
            <td><input v-model="rRepeatPassword" type="password" required="required"></td>
          </tr>
          <tr>
            <td><label>E-mail:</label></td>
            <td><input v-model="rEmail" type="email" required="required"></td>
          </tr>
        </table>
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

      // register form
      rUsername: "",
      rName: "",
      rPassword: "",
      rRepeatPassword: "",
      rEmail: ""
    }
  },
  props: {
    loggedIn: [Boolean]
  },
  methods: {
    submitRegister() {
      if (this.rPassword !== this.rRepeatPassword) {
        alert('Passwords do not match');
      } else {
        this.$emit('register', this.rUsername, this.rName, this.rPassword, this.rEmail);
      }
    }
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
</style>