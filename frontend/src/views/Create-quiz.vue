<template>
  <div>
    <h1>Create quiz</h1>
    <div class="general-container">
      <div>
        <label for="title" >Quiz Title: </label>
        <input type="text" id="title" v-model="quiz.title">
      </div>

<!--      <div>-->
<!--        <label for="timed">Timed </label>-->
<!--        <input type="checkbox" id="timed">-->
<!--      </div>-->

<!--      <div>-->
<!--        <label for="timelimit">Time limit </label>-->
<!--        <input type="time" id="timelimit">-->
<!--      </div>-->

    </div>

    <div class="general-container" v-for="(question, index) in quiz.questions" v-bind:key="index">
      <div>
        <label> Question: </label>
        <input v-model="question.question">
      </div>

<!--      <div>-->
<!--        <label> Type: </label>-->
<!--        <select v-model="question.type">-->
<!--          <option value="multichoice">Multi-choice</option>-->
<!--          <option value="truefalse">True or false</option>-->
<!--          <option value="textinput">Text input</option>-->
<!--        </select>-->
<!--      </div>-->


      <div v-if="question.type === 'multichoice'">
        <label> Correct answer: </label>
        <input v-model="question.correctAnswer">
      </div>
      <div v-if="question.type === 'multichoice'">
        <label> Incorrect answer #1: </label>
        <input v-model="question.incorrectAnswers[0]">
      </div>
      <div v-if="question.type === 'multichoice'">
        <label> Incorrect answer #2: </label>
        <input v-model="question.incorrectAnswers[1]">
      </div>
      <div v-if="question.type === 'multichoice'">
        <label> Incorrect answer #3: </label>
        <input v-model="question.incorrectAnswers[2]">
      </div>

<!--      <div v-if="question.type === 'truefalse'">-->
<!--        <input type="radio" id="test1" name="tf">-->
<!--        <label for="test1">True</label>-->
<!--        <input type="radio" id="test1" name="tf">-->
<!--        <label for="test1">False</label>-->
<!--      </div>-->

<!--      <div>-->
<!--        <label> Correct answer: </label>-->
<!--        <input v-model="question.answer4">-->
<!--      </div>-->

    </div>

    <button v-on:click="addQuestion">Add question</button>

    <button v-on:click="submit">Submit</button>

  </div>
</template>

<script>

import api from '../api.js'

export default {
  name: "Create-quiz",
  data: function() {
    return {
      quiz: {
        title: '',
        questions: []
      }
    }
  },
  methods: {
    r: function () {
      return Math.floor(Math.random() * 100) + 1;
    },
    addQuestion() {
      this.quiz.questions.push(
          {
            question: '',
            type: 'multichoice',
            correctAnswer: '',
            incorrectAnswers: ['', '', '']
          });
    },
    submit() {
      console.log(this.quiz);

      const isBlank = (string) => string.trim() === '';

      // TODO: get rid of alerts and highlight empty or incorrect fields with css

      // check if there are any questions
      if(this.quiz.questions.length < 1) {
        alert('No questions added');
        return;
      }

      // check for no quiz title
      this.quiz.title = this.quiz.title.trim();
      if(this.quiz.title === '') {
        alert('Quiz title is empty');
        return;
      }

      // check every question for empty fields
      for(const question of this.quiz.questions) {
        if(isBlank(question.question) || isBlank(question.correctAnswer)){
          alert('A question field is empty');
          return;
        }

        for(const incorrectAnswer of question.incorrectAnswers) {
          if(isBlank(incorrectAnswer)){
            alert('A question field is empty');
            return;
          }
        }
      }

      // submit, same path different http method, no param
      api.postJson('/quiz', this.quiz)
        .then(response => {
          if(response.status === 200) {
            alert('Quiz created!');
            this.$router.push('/home-teacher');

            // refreshes the page, so the updated data for quiz list is fetched from the server
            this.$router.go();
          } else {
            alert('Error!');
          }
        });
    }
  }
}
</script>

<style scoped>
h1, h2, h3 {
  text-align: center;
}

.general-container {
  margin: 10px auto;
  width: 400px;
  height: max-content;
  border: solid 3px black;
  border-radius: 20px;
  padding: 20px;
  background: white;
}

.general-container > div {
  margin: 10px auto;
  width: max-content;
}

button {
  margin: 10px auto;
  display: block;
}

</style>