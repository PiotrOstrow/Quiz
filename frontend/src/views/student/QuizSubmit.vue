<template>
  <div id="container">
    <h1>Your results for {{ scoreData.title }}</h1>
    <h2>Score: {{ scoreData.score }}/{{ scoreData.questionCount }}</h2>
    <table class="blue-table">
      <thead>
      <tr>
        <th>#</th>
        <th>Quiz question</th>
        <th>Your answers</th>
        <th>Result</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(question, index) in scoreData.questions" v-bind:key="index">
        <td>{{ index + 1 }}</td>
        <td>{{ question.question }}</td>
        <td>{{ question.givenAnswer }}</td>
        <td v-bind:class="{correct: question.correct, incorrect: !question.correct}">{{ question.correct ? 'Correct' : 'Incorrect' }}</td>
      </tr>
      </tbody>
    </table>
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
h1, h2, h3 {
  text-align: center;
}
#container {
  width: max-content;
  margin: 20px auto;
  padding: 20px;
  /*background-color: white;*/
  /*border-radius: 20px;*/
}

.column-container {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.column {
  display: flex;
  width: max-content;
  flex-direction: column;
  text-align: center;
  justify-content: space-around;
}

.column > div {
  margin: 5px auto;
}

.incorrect {
  color: #ff0000;
}

.correct {
  color: #0f8e00;
}

</style>