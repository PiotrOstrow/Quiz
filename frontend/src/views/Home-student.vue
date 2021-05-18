<template>
  <div class="quiz">
    <main>
      <h1>My Quizzes</h1>
      <div class="quizzes-container">
        <div v-for="quiz in quizList" v-bind:key="quiz.ID" class="quiz-element">
          <h3>{{ quiz.title }}</h3>
          <div class="button-container">
            <router-link class="button-router" :to="{ name: 'Quiz', params: { id: quiz.ID }}">Start quiz</router-link>
            <router-link class="button-router" :to="{ name: 'AllResults', params: { id: quiz.ID }}">Scores</router-link>
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
  margin: 5px;
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
  flex-direction: column;
  text-align: center;
  width: 250px;
  height: 150px;
  background-color: white;
  border: solid 2px black;
  border-radius: 20px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.button-container {
  display: flex;
  justify-content: space-around;
  width: 200px;
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
  border-radius: 5px;
  border: solid 2px black;
  transition: transform .2s;

}

.button-router:hover {
  transform: scale(1.05);
  background-color: rgba(0, 162, 232, 1);
}

</style>
