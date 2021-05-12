<template>
  <div id="container">
    <h1>Your results for {{ scoreData.title }}</h1>
    <h2>Score: {{ scoreData.score }}/{{ scoreData.questionCount }}</h2>
    <div class="column-container">

      <div class="column-left">
        <h3>Quiz questions</h3>
        <div v-for="(answer, index) in scoreData.answers" v-bind:key="index">
          {{ scoreData.questions[index].question }}
        </div>
      </div>


      <div class="column-middle">
        <h3>Your answers</h3>
        <div v-for="(givenAnswer, index) in scoreData.givenAnswers" v-bind:key="index">
          {{ givenAnswer }}
        </div>
      </div>


      <div class="column-right">
        <h3>Result:</h3>
        <div v-for="(answer, index) in scoreData.answers" v-bind:key="index">
          {{ answer ? 'Correct' : 'Incorrect' }}
        </div>
      </div>
    </div>

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

.column-container {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.column-left {
  display: flex;
  width: max-content;
  flex-direction: column;
  text-align: center;
  justify-content: space-around;
}

.column-right {
  display: flex;
  width: max-content;
  flex-direction: column;
  text-align: center;
  justify-content: space-around;
}

.column-middle {
  display: flex;
  width: max-content;
  flex-direction: column;
  text-align: center;
  justify-content: space-around;
}



</style>