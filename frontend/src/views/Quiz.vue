<template>
  <div class="quiz-navigation">
    <main>
      <h1>{{ quiz.title }}</h1>
      <h2>Question-questionNumber</h2>
      <div class="question-container" v-for="question in quiz.questions" v-bind:key="question.ID">
        <p class="question-paragraph"> {{ question.question }} </p>
        <form id="choose-answer">
          <div class="radio-input-container">
            <input type="radio" v-bind:id="question.ID + '_answer1'" name="quiz-name" v-bind:value="question.answer1" v-on:click="selected($event, question.ID)">
            <label v-bind:for="question.ID + '_answer1'"> {{ question.answer1 }} </label><br>
          </div>

          <div class="radio-input-container">
            <input type="radio" v-bind:id="question.ID + '_answer2'" name="quiz-name" v-bind:value="question.answer2" v-on:click="selected($event, question.ID)">
            <label v-bind:for="question.ID + '_answer2'"> {{ question.answer2 }} </label><br>
          </div>

          <div class="radio-input-container">
            <input type="radio" v-bind:id="question.ID + '_answer3'" name="quiz-name" v-bind:value="question.answer3" v-on:click="selected($event, question.ID)">
            <label v-bind:for="question.ID + '_answer3'"> {{ question.answer3 }}</label><br>
          </div>

          <div class="radio-input-container">
            <input type="radio" v-bind:id="question.ID + '_answer4'" name="quiz-name" v-bind:value="question.answer4" v-on:click="selected($event, question.ID)">
            <label v-bind:for="question.ID + '_answer4'"> {{ question.answer4 }} </label><br>
          </div>
<!--          <button>Previous Question</button> <button>Next Question</button>-->
        </form>
<!--        <button class="quit-button">Quit</button>-->

      </div>
      <button id="submit-button" @click="submit">Submit</button>
    </main>
  </div>
</template>

<script>

import api from '../api.js';

export default {
  name: "Quiz.vue",
  data: function() {
    return {
      quiz: {},
      answers: new Map()
    }
  },
  methods: {
    submit() {
      console.log(this.answers);

      let data = {
        id: this.quiz.ID,
        answers: {}
      };

      for (let [key, value] of this.answers) {
        console.log(value);
        data.answers[key] = value;
        // data.push({[key]: "svar x"});
      }

      api.postJson('/submit', data);
    },
    selected(event, index) {
      this.answers.set(index, event.target.value);
    }
  },
  mounted() {
    api.getQuiz(this.$route.params.id)
      .then(response => {
        return response.json();
      }).then(json => {
        this.quiz = json;
    });
  }

}
</script>

<style scoped>
h1{
  font-size: 40px;
}

.question-paragraph {
  text-align: center;
}

.question-container {
  width: available;
  background-color: white;
  border-radius: 20px;
  padding: 10%;
  margin: 10px;
}

.radio-input-container {
  margin: 5px auto;
}

form {
  display: grid;
  grid-template-columns: 1fr 1fr;
}


.radio input container {
  /*margin: 10px;*/

}

input[type="radio"] {
  opacity: 0;
  position: fixed;
  width: 0;
}

.question-container label {

  display: inline-block;
  background-color: rgba(0, 162, 232, 0.8);
  font: 400 15px Pangolin;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
}

.question-container label:hover {
  background-color: rgba(0, 162, 232, 1);
  transform: scale(1.05);
}

input[type="radio"]:checked + label {
  background-color: #014055;
}


.quiz-navigation{
  width: 400px;
  margin: auto;
}

section {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto auto auto 50px;
  grid-gap: 20px;

}

#submit-button {
  margin: 20px auto;
  display:block;
  width: 200px;
  height: 50px;
  font-size: 24px;
}

</style>

