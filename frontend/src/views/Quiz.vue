<template>
<div class="quiz">
  <main>
    <h1>Quiz-Name</h1>
    <h2>Question-questionNumber</h2>
    <div class="information-container ">
      <p>Choose the correct answer for XXXXXX: </p>
        <form id="choose-answer" v-on:submit="register-answer">
          <input type="radio" id="answer1" name="answer1" value="answer1-value">
          <label for="answer1">answer1-value</label><br>
          <input type="radio" id="answer2" name="answer2" value="answer2-value">
          <label for="answer2">answer2-value</label><br>
          <input type="radio" id="answer3" name="answer3" value="answer3-value">
          <label for="answer3">answer3-value</label><br>
          <input type="radio" id="answer4" name="answer4" value="answer4-value">
          <label for="answer4">answer4-value</label><br>
          <button>Previous Question</button> <button>Next Question</button>
        </form>

        <button class="quit-button">Quit</button>

    </div>
  </main>
</div>
</template>

<script>
export default {
  name: "Quiz.vue"
}
</script>

<style scoped>
  button {
    font: 400 15px Pangolin;
    background-color: #00a2e8;
    color: white;
    padding: 3px 6px;
    border-style: none;
    border-radius: 5px;
    margin:10px
  }

  .quit-button{
    margin: fill;
    position: center;
    width: 100px;
  }

  h1{
    font-size: 40px;
  }

  .information-container {
    width: available;
    background-color: white;
    border-radius: 20px;
    padding: 10%;
  }

  .quiz{
    width: 400px;
    margin: auto;
  }

  section {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto 50px;
    grid-gap: 20px;

  }
</style>
