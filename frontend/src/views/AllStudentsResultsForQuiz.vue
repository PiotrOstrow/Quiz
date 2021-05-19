<template>
  <div>
    <h1>{{ quiz.title }}</h1>

    <h2>Scoreboard:</h2>
    <h3 v-show="students.length === 0">No student has completed this quiz yet</h3>
    <table v-show="students.length > 0" class="blue-table">
      <thead>
      <tr>
        <th>Name</th>
        <th>Highest score</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(student, index) in students" v-bind:key="index">
        <td>{{ student.name }}</td>
        <td>{{ student.maxScore }} / {{ quiz.numberOfQuestions }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import api from "@/api";

export default {
  name: "AllStudentsResultsForQuiz",
  data: function () {
    return {
      quiz: {},
      students: [],
      sortedScores: []
    }
  },
  // computed: {
  //   sortMaxScore: function() {
  //       function compare(a, b) {
  //         if(a.students.maxScore < b.students.maxScore) {
  //
  //         }
  //   }
  // },
  mounted() {
    api.get('/all-results/' + this.$route.params.id)
        .then(response => response.json())
        .then(json => {
          this.quiz = json.quiz;
          this.students = json.students;
        });
  }
}
</script>


<style scoped>

h1, h2, h3 {
  text-align: center;
}

</style>