<template>
  <section class="grid-container">
    <div class="results">
      <h1>Results</h1>
      <main>
        <div v-for="quiz in quizResults"
             v-bind:key="quiz.quizID" class="results-container">
          <h3>{{ quiz.title }}</h3>
          <p>{{quiz.score}} out of 5 questions correct</p>
        </div>
      </main>
    </div>
  </section>

</template>

<script>
import api from '../api.js';
export default {
  name: "Results.vue",
  data() {
    return {
      quizResults: '',
    }
  },
  methods: {

  },
  props: {
    quizList: [Array, Object]
  },
  mounted() {
    api.getResults().then(response => {
      return response.json();
    }).then(json => {
      this.quizResults = json;
      console.log(this.quizResults);
    });
  }
}
</script>

<style scoped>

body {
  background-color: white;
}

h1 {
  font-size: 40px;
  text-align: center;
}

/*section {*/
/*  display: flex;*/
/*  grid-template-columns: 1fr 1fr;*/
/*  grid-template-rows: auto auto auto 50px;*/
/*  grid-template-areas: "header" "navigation" "main-content" "footer";*/
/*  grid-gap: 50px;*/
/*}*/

section.grid-container {
  width: 600px;
  margin: 15px auto;
}

main {
  grid-area: main-content;
  display: flex;
  grid-template-columns: 1fr;
  grid-gap: 20px;
}

.underlineSubjectTitle {
  border-bottom: 2px solid #00a2e8;
  margin: 10px;

}

.results-container {
  width: 100%;
  background-color: white;
  border-radius: 20px;
  padding: 10%;
  margin: 10px;
}

</style>