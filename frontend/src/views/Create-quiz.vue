<template>
  <div>
    <h1>Create quiz</h1>
    <textarea id="title-textarea" placeholder="Enter quiz title here..." v-on:keypress="textareaOnKeyPress($event)" v-model="quiz.title"></textarea>
<!--    <div class="general-container">-->
<!--      <div>-->
<!--        <label for="title" >Quiz Title: </label>-->
<!--        <input type="text" id="title" v-model="quiz.title">-->
<!--      </div>-->
<!--    </div>-->

    <table class="blue-table">
      <thead>
      <tr>
        <th>Question</th>
        <th>Correct Answer</th>
        <th>Incorrect #1</th>
        <th>Incorrect #2</th>
        <th>Incorrect #3</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(question, index) in quiz.questions" v-bind:key="index">
        <td><textarea v-on:keypress="textareaOnKeyPress($event)" v-on:input="autoGrow($event)" placeholder="Enter question here..." v-model="question.question" v-on:focus="$event.target.select()"/></td>
        <td><textarea v-on:keypress="textareaOnKeyPress($event)" v-on:input="autoGrow($event)" placeholder="Correct answer..." v-model="question.correctAnswer" v-on:focus="$event.target.select()"/></td>
        <td><textarea v-on:keypress="textareaOnKeyPress($event)" v-on:input="autoGrow($event)" placeholder="Incorrect #1" v-model="question.incorrectAnswers[0]" v-on:focus="$event.target.select()"/></td>
        <td><textarea v-on:keypress="textareaOnKeyPress($event)" v-on:input="autoGrow($event)" placeholder="Incorrect #2" v-model="question.incorrectAnswers[1]" v-on:focus="$event.target.select()"/></td>
        <td><textarea v-on:keypress="textareaOnKeyPress($event)" v-on:input="autoGrow($event)" placeholder="Incorrect #3" v-model="question.incorrectAnswers[2]" v-on:focus="$event.target.select()"/></td>
      </tr>
      </tbody>
    </table>

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
    autoGrow(event) {
      console.log(event);
      event.target.style.height = (event.target.scrollHeight)+"px";
    },
    textareaOnKeyPress(event) {
      if(event.keyCode === 13) { // enter
        event.preventDefault();
        event.target.blur();
      }
    },
    addQuestion() {
      this.quiz.questions.push(
          {
            question: '',
            type: 'multichoice',
            correctAnswer: '',
            incorrectAnswers: []
          });
    },
    submit() {
      console.log(this.quiz);

      const isBlank = (string) => string.trim() === '';

      // TODO: get rid of alerts and highlight empty or incorrect fields with css

      // check if there are any questions
      if(this.quiz.questions.length < 1) {
        this.$emit('showConfirmModal', {
          title: 'No questions added!',
          message: 'Please make sure to have at least one question!',
          okButton: 'OK I understand'
        });
        return;
      }

      // check for no quiz title
      this.quiz.title = this.quiz.title.trim();
      if(this.quiz.title === '') {
        this.$emit('showConfirmModal', {
          title: 'Quiz title is empty!',
          message: 'Please make sure to set a quiz title!',
          okButton: 'OK I understand'
        });
        return;
      }

      // check every question for empty fields
      for(const question of this.quiz.questions) {
        if(isBlank(question.question) || isBlank(question.correctAnswer)){
          this.$emit('showConfirmModal', {
            title: 'A question field is empty!',
            message: 'Please make to a fill every question field!',
            okButton: 'OK I understand'
          });
          return;
        }

        for(const incorrectAnswer of question.incorrectAnswers) {
          if(isBlank(incorrectAnswer)){
            this.$emit('showConfirmModal', {
              title: 'A question field is empty!',
              message: 'Please make sure to fill all fields!',
              okButton: 'OK I understand'
            });
            return;
          }
        }
      }

      // submit, same path different http method, no param
      api.postJson('/quiz', this.quiz)
        .then(response => {
          if(response.status === 200) {
            this.$emit('showConfirmModal', {
              title: 'Quiz created!',
              message: this.quiz.title + ' has been created!',
              okButton: 'OK',
              callback: () => {
                this.$router.push('/home-teacher');

                // refreshes the page, so the updated data for quiz list is fetched from the server
                this.$router.go();
              }
            });
          } else {
            this.$emit('showConfirmModal', {
              title: 'An error occurred!',
              message: 'Server error, could not create the quiz.',
              okButton: 'OK'
            });
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

table {
  width: 850px;
}

textarea {
  border-style: none;
  background-color: transparent;
  cursor: pointer;
  padding: 5px;
  text-align: center;
  word-break: break-all;
  resize: none;
  /*white-space: nowrap;*/
  overflow: hidden;
  /*height: ;*/
  height: 25px;
}

textarea:focus {
  border-style: none;
  background-color: white;
  cursor: text;
}

#title-textarea {
  display: block;
  margin: 0 auto;
  font-size: 24px;
  width: 850px;
  height: 39px;
  font-weight: bold;
  font-family: Pangolin, sans-serif;
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