<template>
  <div class="quiz">
    <main>
      <h1>My Quizzes</h1>
      <div class="quizzes-container">
        <router-link v-for="quiz in quizList" :to="{ name: 'Quiz', params: { id: quiz.ID }}" class="quiz-element"
            v-bind:key="quiz.ID"
        >{{ quiz.title }}</router-link>
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
  /*width: available;*/
  /*background-color: white;*/
  /*border-radius: 20px;*/
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 20px;
}

.quiz {
  /*width: 200px;*/
  width: min-content;
  display: block;
  margin: auto;
}

.quiz-element {
  list-style: none;
  text-align: center;
  /*margin: 10px;*/
  width: 200px;
  height: 100px;
  font: 400 15px Pangolin;
  background-color: rgba(0, 162, 232, 0.8);
  color: white;
  /*padding: 3px 6px;*/
  border: 2px solid #014055;
  border-radius: 5px;
  transition: transform .2s;

  display:flex;
  justify-content: center;
  align-items: center;
}

.quiz-element:hover {
  background-color: rgba(0, 162, 232, 1);
  transform: scale(1.05);
}

a {
  text-decoration: none;
  color: white;

}


</style>
