<template>
<div>
  <h1> WELCOME TEACHERS :) </h1>

  <h2> Your students: </h2>
  <table class="blue-table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Username</th>
        <th>Email</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(student, index) in users" v-bind:key="index">
        <td>{{ student.name }}</td>
        <td>{{ student.username }}</td>
        <td>{{ student.email }}</td>
      </tr>
    </tbody>
  </table>

  <h2> Quizzes: </h2>
  <table class="blue-table">
    <thead>
    <tr>
      <th>Name</th>
      <th>Category</th>
      <th>Number of questions</th>
    </tr>
    </thead>
    <tbody>
      <tr v-for="(quiz, index) in quizList" v-bind:key="index" v-on:click="onQuizClicked(quiz.ID)">
        <td>{{ quiz.title }}</td>
        <td> - </td>
        <td>{{ quiz.questionCount }}</td>
      </tr>
    </tbody>
  </table>

</div>
</template>

<script>
export default {
  name: "Home-teacher.vue",
  props: ['quizList', 'users'],
  methods: {
    onQuizClicked(ID) {
      this.$router.push('quiz-overview/' + ID);
    }
  }
}
</script>

<style scoped>
h1, h2, h3, p {
  text-align: center;
}
</style>