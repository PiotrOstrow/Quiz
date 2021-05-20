<template>
<!--  <section class="grid-container">-->
<!--    <h1>Results</h1>-->
<!--    <div class="results-container">-->
<!--      <main>-->
<!--        <div v-for="quiz in quizResults"-->
<!--             v-bind:key="quiz.quizID">-->
<!--          <h3>{{ quiz.title }}</h3>-->
<!--          <p>{{quiz.score}} out of {{ quiz.question_count }} questions correct</p>-->
<!--        </div>-->
<!--      </main>-->
<!--    </div>-->
<!--  </section>-->
  <div>
    <h1>Your Results</h1>
    <table class="blue-table">
      <thead>
      <tr>
        <th>Quiz</th>
        <th>Highest score</th>
        <th>Attempts</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="quiz in quizResults" v-bind:key="quiz.quizID">
        <td>{{ quiz.title }}</td>
        <td>{{ quiz.maxScore }} out of {{ quiz.question_count }} questions correct</td>
       <td>{{ quiz.attempts }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import api from '../api.js';
export default {
  name: "Results.vue",
  data() {
    return {
      quizResults: '',
    }
  },
  methods: {

  },
  props: {
    quizList: [Array, Object]
  },
  mounted() {
    api.getResults()
        .then(response => response.json())
        .then(json => this.quizResults = json);
  }
}
</script>

<style scoped>

h1 {
  font-size: 40px;
  text-align: center;
}

/*section {*/
/*  display: flex;*/
/*  grid-template-columns: 1fr 1fr;*/
/*  grid-template-rows: auto auto auto 50px;*/
/*  grid-template-areas: "header" "navigation" "main-content" "footer";*/
/*  grid-gap: 50px;*/
/*}*/

section.grid-container {
  width: 600px;
  margin: 15px auto;
}

main {
  grid-area: main-content;
  grid-template-columns: 1fr;
}

/*.underlineSubjectTitle {*/
/*  border-bottom: 2px solid #00a2e8;*/
/*  margin: 10px;*/
/*}*/

.results-container {
  width: 100%;
  background-color: white;
  border-radius: 20px;
  padding: 10%;
  margin: 10px;
}

</style>