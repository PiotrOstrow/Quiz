<template>
  <div class="quiz-navigation">
    <main>
      <h1>{{ quiz.title }}</h1>
      <div class="question-container" v-for="(question, index) in quiz.questions" v-bind:key="question.ID">

        <div class="h3-container">
          <h2>Question {{index+1}}</h2>
        </div>
        <h3 class="question-paragraph"> {{ question.question }} </h3>
        <form v-on:submit.prevent="" v-if="question.answers">
          <div class="radio-input-container" v-if="question.answers[0]">
            <input type="radio" v-bind:id="question.ID + '_answer1'" name="quiz-name" v-bind:value="question.answers[0]" v-on:click="selected($event, question.ID)">
            <label v-bind:for="question.ID + '_answer1'"> {{ question.answers[0] }} </label><br>
          </div>

          <div class="radio-input-container" v-if="question.answers[1]">
            <input type="radio" v-bind:id="question.ID + '_answer2'" name="quiz-name" v-bind:value="question.answers[1]" v-on:click="selected($event, question.ID)">
            <label v-bind:for="question.ID + '_answer2'"> {{ question.answers[1] }} </label><br>
          </div>

          <div class="radio-input-container" v-if="question.answers[2]">
            <input type="radio" v-bind:id="question.ID + '_answer3'" name="quiz-name" v-bind:value="question.answers[2]" v-on:click="selected($event, question.ID)">
            <label v-bind:for="question.ID + '_answer3'"> {{ question.answers[2] }}</label><br>
          </div>

          <div class="radio-input-container" v-if="question.answers[3]">
            <input type="radio" v-bind:id="question.ID + '_answer4'" name="quiz-name" v-bind:value="question.answers[3]" v-on:click="selected($event, question.ID)">
            <label v-bind:for="question.ID + '_answer4'"> {{ question.answers[3] }} </label><br>
          </div>
        </form>
        <div v-else class="textinput-container">
          <input placeholder="Enter answer" class="textinput" v-on:input="selected($event, question.ID)">
        </div>
      </div>
      <button id="submit-button" @click="submit" :disabled="!submitEnabled">Submit</button>
    </main>
  </div>
</template>

<script>

import api from '../../api.js';

export default {
  name: "Quiz.vue",
  data: function() {
    return {
      quiz: {},
      answers: new Map(),
      submitEnabled: false,
      isRepetitionQuiz: false,
      isSubmitting: false
    }
  },
  methods: {
    submit() {
      if(this.answers.size < this.quiz.questions.length) {
        this.$emit('showConfirmModal', {
          title: 'Not all questions answered!',
          message: 'Please fill in all the questions and submit again!',
          okButton: 'Ok'
        });
        return;
      }

      this.isSubmitting = true;

      let data = {
        id: this.quiz.ID,
        answers: {}
      };

      for (let [key, value] of this.answers)
        data.answers[key] = value;

      let apiCall = this.isRepetitionQuiz ?
          api.postJson('/submit-repetition-quiz', data) : api.postJson('/submit', data);

      apiCall.then(response => response.json())
        .then(json => {
          let resultData = {
            score: json.score,
            questionCount: this.quiz.questions.length,
            title: this.quiz.title,
            questions: this.quiz.questions
          };
          let map = new Map();
          for(const answer of json.answers)
            map.set(answer.questionID, answer.correct);

          for(const question of resultData.questions) {
            question.correct = map.get(question.ID);
            question.givenAnswer = this.answers.get(question.ID);
          }

          this.$emit('showSingleResult', resultData);
        });
    },
    selected(event, id) { // used for both radio boxes and text input
      this.answers.set(id, event.target.value);

      this.submitEnabled = this.answers.size === this.quiz.questions.length;
    },
    onBeforeUnload(event) {
      event.preventDefault()
      // Chrome requires returnValue to be set.
      event.returnValue = ""
    }
  },
  beforeRouteLeave(to, from, nextOriginal) {
    let next = () => {
      window.removeEventListener('beforeunload', this.onBeforeUnload);
      nextOriginal();
    }

    if(!this.isSubmitting && to.path !== '/') {
      this.$emit('showConfirmModal', {
        title: 'Quiz not submitted!',
        message: 'All your answers will be lost. Are you sure you want to leave?',
        okButton: 'Yes',
        cancelButton: 'Cancel',
        callback: (ok) => {
          if(ok)
            next();
        }
      });
    } else {
      next();
    }
  },
  beforeMount() {
    window.addEventListener('beforeunload', this.onBeforeUnload);
  },
  mounted() {
    this.isRepetitionQuiz = this.$route.params.id == null;
    let promise;

    if(this.isRepetitionQuiz) {
      promise = api.get('/repetition-quiz');
    } else {
      promise = api.getQuiz(this.$route.params.id);
    }

    promise
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

.h3-container {
  width: 100%;
  background-color: #F29544;
  padding: 5px;
  color: #fcfcfc;
}

main {
  width: max-content;
  margin: 0 auto;
}

.question-paragraph {
  text-align: center;
  font-size:20px;
  padding: 15px;
  /*border: solid 1px black;*/
}

.question-container {
  width: 100%;
  background-color: white;
  border-radius: 2px;
  margin: 30px auto;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
}

form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-content: center;
  /*grid-gap: 10px;*/
}

.question-container h2 {
  margin: 0;
}

.question-container h3 {
  margin: 5px;
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

.textinput-container {
  margin: 20px auto;
  width: max-content;
  padding-bottom: 20px; /* margin doesn't work at the bottom for whatever reason */
}

.textinput {
  display: block;
  text-align: center;
}

#submit-button {
  margin: 20px auto;
  display:block;
  width: 200px;
  height: 50px;
  font-size: 24px;
  /*border: solid 2px black;*/
}

@media screen and (min-width:670px) {
  h1{
    font-size: 40px;
    text-align: center;
  }

  .h3-container {
    width: 100%;
    background-color: #F29544;
    padding: 5px;
    color: #fcfcfc;
  }

  main {
    width: max-content;
    margin: 0 auto;
  }

  .question-paragraph {
    text-align: center;
    font-size:20px;
    padding: 15px;
    /*border: solid 1px black;*/
  }

  .question-container {
    width: 100%;
    background-color: white;
    border-radius: 2px;
    margin: 30px auto;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  }

  form {
    display: flex;
    /*grid-template-columns: 1fr 1fr 1fr 1fr;*/
    justify-content: center;
    /*grid-gap: 10px;*/
  }

  .question-container h2 {
    margin: 0;
  }

  .question-container h3 {
    margin: 5px;
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

  .textinput-container {
    margin: 20px auto;
    width: max-content;
    padding-bottom: 20px; /* margin doesn't work at the bottom for whatever reason */
  }

  .textinput {
    display: block;
    text-align: center;
  }

  #submit-button {
    margin: 20px auto;
    display:block;
    width: 200px;
    height: 50px;
    font-size: 24px;
    /*border: solid 2px black;*/
  }
}

</style>

