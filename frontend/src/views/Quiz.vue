<template>
  <div class="quiz-navigation">
    <main>
      <h1>{{ quiz.title }}</h1>
      <div class="question-container" v-for="(question, index) in quiz.questions" v-bind:key="question.ID">
        <h2>Question {{index+1}}</h2>
        <h3 class="question-paragraph"> {{ question.question }} </h3>
        <form id="choose-answer">
          <div class="radio-input-container">
            <input type="radio" v-bind:id="question.ID + '_answer1'" name="quiz-name" v-bind:value="question.answers[0]" v-on:click="selected($event, question.ID)">
            <label v-bind:for="question.ID + '_answer1'"> {{ question.answers[0] }} </label><br>
          </div>

          <div class="radio-input-container">
            <input type="radio" v-bind:id="question.ID + '_answer2'" name="quiz-name" v-bind:value="question.answers[1]" v-on:click="selected($event, question.ID)">
            <label v-bind:for="question.ID + '_answer2'"> {{ question.answers[1] }} </label><br>
          </div>

          <div class="radio-input-container">
            <input type="radio" v-bind:id="question.ID + '_answer3'" name="quiz-name" v-bind:value="question.answers[2]" v-on:click="selected($event, question.ID)">
            <label v-bind:for="question.ID + '_answer3'"> {{ question.answers[2] }}</label><br>
          </div>

          <div class="radio-input-container">
            <input type="radio" v-bind:id="question.ID + '_answer4'" name="quiz-name" v-bind:value="question.answers[3]" v-on:click="selected($event, question.ID)">
            <label v-bind:for="question.ID + '_answer4'"> {{ question.answers[3] }} </label><br>
          </div>
<!--          <button>Previous Question</button> <button>Next Question</button>-->
        </form>
<!--        <button class="quit-button">Quit</button>-->

      </div>
      <button id="submit-button" @click="submit" :disabled="!submitEnabled">Submit</button>
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
      answers: new Map(),
      submitEnabled: false
    }
  },
  methods: {
    submit() {
      if(this.answers.size < this.quiz.questions.length) {
        alert('Not all questions answered');
        return;
      }

      let data = {
        id: this.quiz.ID,
        answers: {}
      };

      for (let [key, value] of this.answers)
        data.answers[key] = value;

      api.postJson('/submit', data)
        .then(response => response.json())
        .then(json => {
          let resultData = {
            score: json.score,
            questionCount: this.quiz.questions.length,
            title: this.quiz.title,
            questions: this.quiz.questions,
            answers: json.answers,
            givenAnswers: json.givenAnswers,
          };
          this.$emit('showSingleResult', resultData);
        });
    },
    selected(event, id) {
      this.answers.set(id, event.target.value);

      this.submitEnabled = this.answers.size === this.quiz.questions.length;
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
  text-align: center;
}

.question-paragraph {
  text-align: center;
}

.question-container {
  width: max-content;
  background-color: white;
  border-radius: 20px;
  padding: 20px;
  margin: 10px auto;
  border: solid 3px black;
}

.radio-input-container {
  margin: 5px auto;
}

.radio-input-container label{
  width: 140px;
  text-align: center;
  border: solid 2px black;
}

form {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 10px;
}


.radio input container {
  /*margin: 10px;*/

}

input[type="radio"] {
  opacity: 0;
  position: fixed;
  width: 0;
}

.question-container h2 {
  margin: 0;
}

.question-container h3 {
  margin: 5px;
}

.question-container label {
  display: inline-block;
  background-color: rgba(0, 162, 232, 0.8);
  font: 400 15px Pangolin;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  transition: transform .2s;
}

.question-container label:hover {
  background-color: rgba(0, 162, 232, 1);
  transform: scale(1.05);
}

input[type="radio"]:checked + label {
  background-color: #014055;
}


.quiz-navigation{
  /*width: 400px;*/
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
  border: solid 2px black;
}

</style>

