<template>
  <div id="container">
    <h1>Your results for {{ scoreData.title }}</h1>
    <h2>Score: {{ scoreData.score }}/{{ scoreData.questionCount }}</h2>
    <div v-for="(answer, index) in scoreData.answers" v-bind:key="index">{{ scoreData.questions[index].question }}: {{ answer ? 'Correct' : 'Incorrect' }}</div>
  </div>
</template>

<script>
export default {
  name: "QuizSubmit",
  props: {
    scoreData: [Object]
  }
}
</script>

<style scoped>
#container {
  width: max-content;
  margin: 20px auto;
  padding: 20px;
  background-color: white;
  border-radius: 20px;

}
</style>