<template>
<div>
  <h1>Repetition Quiz</h1>
  <h2>Any questions you miss can be found here, you can take a quiz with only those questions.</h2>
  <h3 v-show="quizResults.length === 0">Well done, you have answered all questions correctly so far!</h3>
  <table v-show="quizResults.length > 0" class="blue-table">
    <thead>
    <tr>
      <th>Quiz</th>
      <th>Missed Questions</th>
<!--      <th>Retake/Repeat</th>-->
    </tr>
    </thead>
    <tbody>
    <tr v-for="quiz in quizResults" v-bind:key="quiz.quizID">
      <td>{{ quiz.title }}</td>
      <td>{{ quiz.incorrectAnswerCount }} out of {{ quiz.question_count }} questions incorrect</td>
<!--        <button class="icon-button" v-on:click.stop="Retake(quiz.ID)">-->
<!--        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-repeat" viewBox="0 0 16 16">-->
<!--          <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>-->
<!--          <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>-->
<!--        </svg>-->
<!--      </button>-->
<!--        <button class="icon-button" v-on:click="Repeat(quiz.ID)">-->
<!--          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-left" viewBox="0 0 16 16">-->
<!--            <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2z"/>-->
<!--            <path fill-rule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z"/>-->
<!--          </svg>-->
<!--        </button>-->
    </tr>
    </tbody>

  </table>

  <button v-show="quizResults.length > 0" id="retake-button" v-on:click="startQuiz">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-repeat" viewBox="0 0 16 16">
      <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>
      <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>
    </svg>
    Start repetition quiz
  </button>

</div>
</template>

<script>

import api from "@/api";

export default {
  name: "RepetitionOverview",
  data() {
    return {
      quizResults: '',
    }
  },
  methods: {
    startQuiz() {
      this.$router.push('/student/quiz');
    }
  },
  props: {
    quizList: [Array, Object]
  },
  mounted() {
    api.get('/failed-questions')
        .then(response => response.json())
        .then(json => this.quizResults = json);
  }
}
</script>

<style scoped>

#retake-button {
  margin: 0 auto;
  display: block;
}

h1 {
  font-size: 40px;
}

h1, h2, h3 {
  text-align: center;
}

section {
  width: 600px;
  margin: 15px auto;
}

main {
  grid-area: main-content;
  grid-template-columns: 1fr;
}

</style>