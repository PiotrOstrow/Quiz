<template>
  <div class="quiz">
    <main>
      <h1>My Quizzes</h1>
      <div class="quizzes-container">
        <div v-for="quiz in quizList" v-bind:key="quiz.ID"  class="quiz-element">
          {{ quiz.title }}
          <div class="button-container">
            <router-link class="button-router" :to="{ name: 'Quiz', params: { id: quiz.ID }}">Start quiz</router-link>
            <router-link class="button-router" :to="{ name: 'Quiz', params: { id: quiz.ID }}">Scores</router-link>
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

.quizzes-container {
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 20px;
}

.quiz {
  width: min-content;
  display: block;
  margin: auto;
}

.quiz-element {
  flex-direction: column;
  list-style: none;
  text-align: center;
  width: 250px;
  height: 150px;
  background-color: white;
  border: solid 2px black;
  border-radius: 20px;
  transition: transform .2s;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.quiz-element:hover {
  background-color: #00a2e8;
  color: white;
}

.button-container {
  display: flex;
  justify-content: space-around;
  width: 200px;
}

.quiz-element a {
  text-decoration: none;
  color: white;
}

.quiz-element:hover .button-router {
  color: white;
  cursor: pointer;
  background-color: rgba(0, 162, 232, 1);
  border: solid 2px black;
}

.button-router {
  font: 400 15px Pangolin;
  background-color: rgba(0, 162, 232, 0.8);
  color: white;
  padding: 3px 6px;
  border-style: none;
  border-radius: 5px;
  transition: transform .2s;
}

.button-router:hover {
  transform: scale(1.05);
}

</style>
