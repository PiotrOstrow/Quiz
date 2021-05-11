<template>
  <div>
    <h1>Your result for {{scoreData.title}}</h1>
    <h2>Score: {{ scoreData.score }}/{{scoreData.questionCount}}</h2>
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

</style>