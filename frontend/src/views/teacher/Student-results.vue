<template>
  <div>
    <h1>Scoreboard</h1>
    <h3>{{ student.name }}</h3>
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
import api from "@/api";

export default {
  name: "StudentResults",
  data() {
    return {
      student: {},
      quizResults: []
    }
  },
  props: ['users'],
  mounted() {
    api.get('/student-results/' + this.$route.params.id)
        .then(response => response.json())
        .then(json => {
          this.student = json.student;
          this.quizResults = json.quizResults;
        });
  }
}
</script>


<style scoped>

h1, h2, h3 {
  text-align: center;
}

</style>
