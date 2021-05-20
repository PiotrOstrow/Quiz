<template>
  <div class="quiz">
    <main>
      <h1>My Quizzes</h1>
      <div class="quizzes-container">
        <div v-for="quiz in quizList" v-bind:key="quiz.ID" class="quiz-element">
          <div class="quiz-element-titlediv">
            <h3>{{ quiz.title }}</h3>
          </div>
          <p>Questions: 7</p> <p>Completed: No</p>
          <div class="button-container">
            <button v-on:click="$router.push('/quiz/' + quiz.ID)">Start quiz</button>
            <button v-on:click="$router.push('/all-results/' + quiz.ID)">Scores</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: "Home-student.vue",
  methods: {},
  props: {
    quizList: [Array, Object]
  },
}
</script>

<style scoped>

h1 {
  font-size: 40px;
  text-align: center;
}

h3 {
  margin: 2px;
}

.quiz {
  width: min-content;
  display: block;
  margin: auto;
}

.quizzes-container {
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 20px;
}

.quiz-element {
  /*display: flex;*/
  /*flex-direction: column;*/
  text-align: center;
  width: 275px;
  height: 150px;
  background-color: white;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  border-radius: 2px;
  justify-content: space-evenly;
  align-items: center;
  position: relative;
}

.quiz-element p {
  display: inline-block;
  margin: 15px;
}

.quiz-element-titlediv {
  display: block;
  border-bottom: solid 1px;
  font-family:Pangolin, sans-serif;
  text-align: center;
  font-size: 22px;
  font-weight: bold;
  background-color: #00a2e8;
  color: white;
  padding: 10px;
  cursor: pointer;
}

.button-container {
  /*display: flex;*/
  /*justify-content: space-around;*/
  width: 100%;
  height: max-content;
  position: absolute;
  bottom: 0;

}

.button-container button {
  margin: 10px;
}

/*.quiz-element a {*/
/*  text-decoration: none;*/
/*  color: white;*/
/*}*/

/*.quiz-element:hover .button-router {*/
/*  color: white;*/
/*  cursor: pointer;*/
/*}*/

.button-router {
  text-decoration: none;
  color: white;
  background-color: rgba(0, 162, 232, 0.8);
  padding: 3px 6px;
  border-radius: 2px;
  /*border: solid 2px black;*/
  transition: transform .2s;

}

.button-router:hover {
  transform: scale(1.05);
  background-color: rgba(0, 162, 232, 1);
}

</style>
