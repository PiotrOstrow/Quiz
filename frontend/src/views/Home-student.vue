<template>
  <div class="quiz">
    <main>
      <h1>My Quizzes</h1>
      <quizzes>
        <li v-for="quiz in quizList"
            v-bind:key="quiz.id">
          <router-link to="/Quiz">{{ quiz.title }}</router-link>
        </li>
      </quizzes>
    </main>
  </div>
</template>

<script>
export default {
  name: "Home-student.vue",
  methods: {},
  props: {
    quizList: [Array, Object]
  }
}
</script>

<style scoped>

h1 {
  font-size: 40px;
}

.quizzes-container {
  width: available;
  background-color: white;
  border-radius: 20px;
  padding: 10%;
}

.quiz {
  width: 400px;
  margin: auto;
}

ul {
  list-style: none;
}

a {
  font: 400 15px Pangolin;
  background-color: #00a2e8;
  color: white;
  padding: 3px 6px;
  border-style: none;
  border-radius: 5px;
}


</style>
