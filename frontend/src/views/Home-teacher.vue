<template>
<div>
  <h1> WELCOME TEACHERS :) </h1>

  <h2> Your students: </h2>
  <table>
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
  <table>
    <thead>
    <tr>
      <th>Name</th>
      <th>Category</th>
      <th>Number of questions</th>
    </tr>
    </thead>
    <tbody>
      <tr v-for="(quiz, index) in quizList" v-bind:key="index">
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
  data: function() {
    return {
      students: [{name: 'Bob'}, {name: 'Bob2'}, {name: 'Bob3'}, {name: 'Bob4'}, {name: 'Bob5'}]
    }
  },
  props: ['quizList', 'users']
}
</script>

<style scoped>
h1, h2, h3, p{
  text-align: center;
}

table {
  margin: 25px auto;
  border-collapse: collapse;
  font-size: 0.9em;
  font-family: sans-serif;
  width: 500px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
}

table thead tr {
  background-color: #00a2e8;
  color: #ffffff;
  text-align: left;
}

table th,
table td {
  padding: 12px 15px;
  font-family: Pangolin, sans-serif;
  text-align: center;
}

table tbody tr {
  border-bottom: 1px solid #dddddd;
  cursor: pointer;
}

table tbody tr:nth-of-type(even) {
  background-color: #f3f3f3;
}

table tbody tr:last-of-type {
  border-bottom: 2px solid #00a2e8;
}

table tbody tr:hover {
  background-color: #00a2e8;
  color: white;
}

table tbody tr.active-row {
  font-weight: bold;
  color: #00a2e8;
}
</style>