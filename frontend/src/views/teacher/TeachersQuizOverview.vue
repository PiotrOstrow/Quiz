<template>
  <div>
    <h1>{{ quiz.title }}</h1>

    <h2>Results:</h2>
    <h3 v-show="students.length === 0">No student has completed this quiz yet</h3>

    <h3 v-show="students.length > 0">Average max score: {{this.averageMaxScore}} / {{quiz.numberOfQuestions}}</h3>
    <table v-show="students.length > 0" class="blue-table">
      <thead>
      <tr>
        <th>Name</th>
        <th>Attempts</th>
        <th>Highest score</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(student, index) in students" v-bind:key="index">
        <td>{{ student.name }}</td>
        <td>{{ student.attempts }}</td>
        <td>{{ student.maxScore }} / {{ quiz.numberOfQuestions }}</td>
      </tr>
      </tbody>
    </table>

<!--    <h2>Questions:</h2>-->
  </div>
</template>

<script>

import api from '../../api.js'

export default {
  name: "Quiz-overview",
  data: function () {
    return {
      quiz: {numberOfQuestions: 0},
      students: []
    }
  },
  computed: {
    averageMaxScore() {
      if(this.students.length === 0)
        return 0;

      let total = 0;
      for(const student of this.students)
        total += Number(student.maxScore);

      return (total / this.students.length).toFixed(2);
    }
  },
  mounted() {
    api.get('/teacher/quiz-overview/' + this.$route.params.id)
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