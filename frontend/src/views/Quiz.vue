<template>
<div class="quiz">
  <main>
    <h1>My Quizzes</h1>
    <ol class="information-container ">
      <li>quiz1-title</li>
      <li>quiz2-title</li>
      <button>Home</button>
    </ol>
  </main>
</div>
</template>

<script>
export default {
  name: "Quiz.vue",
  methods: {

  }

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
