<template>
  <div id="main-container">
    <h1>Create quiz</h1>
    <textarea id="title-textarea" placeholder="Enter quiz title here..." v-on:keypress="textareaOnKeyPress($event)" v-model="quiz.title"></textarea>

    <div id="category-container">
<!--      <select id="category">-->
<!--        <option v-for="(category) of quizCategories" value="" v-bind:key="category.ID"> {{category.categoryName}} </option>-->
<!--      </select>-->
      <StyledSelect v-bind:options="quizCategoryNames" v-on:input="onCategoryChanged" ref="styledSelect"/>
      <button>Create a new category</button>
    </div>

    <table class="blue-table">
      <thead>
      <tr>
        <th>#</th>
        <th>Question</th>
        <th>Correct Answer</th>
        <th>Incorrect #1</th>
        <th>Incorrect #2</th>
        <th>Incorrect #3</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(question, index) in quiz.questions" v-bind:key="index">
        <td>{{index + 1}}</td>
        <td><textarea v-on:keypress="textareaOnKeyPress($event)" v-on:input="autoGrow($event)" placeholder="Enter question here..." v-model="question.question" v-on:focus="$event.target.select()"/></td>
        <td><textarea v-on:keypress="textareaOnKeyPress($event)" v-on:input="autoGrow($event)" placeholder="Correct answer..." v-model="question.correctAnswer" v-on:focus="$event.target.select()"/></td>
        <td><textarea v-on:keypress="textareaOnKeyPress($event)" v-on:input="autoGrow($event)" placeholder="Incorrect #1" v-model="question.incorrectAnswers[0]" v-on:focus="$event.target.select()"/></td>
        <td><textarea v-on:keypress="textareaOnKeyPress($event)" v-on:input="autoGrow($event)" placeholder="Incorrect #2" v-model="question.incorrectAnswers[1]" v-on:focus="$event.target.select()"/></td>
        <td><textarea v-on:keypress="textareaOnKeyPress($event)" v-on:input="autoGrow($event)" placeholder="Incorrect #3" v-model="question.incorrectAnswers[2]" v-on:focus="$event.target.select()"/></td>
        <td>
          <button class="icon-button" v-on:click.stop="deleteQuestion(index)">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
              <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
            </svg>
          </button>
        </td>
      </tr>
      </tbody>
    </table>


    <button v-on:click="addQuestion">Add question</button>

    <button v-on:click="submit">Save</button>

  </div>
</template>

<script>

import StyledSelect from '@/components/StyledSelect.vue'
import api from '../api.js'

export default {
  components: { StyledSelect },
  name: "Create-quiz",
  props: ['quizCategories'],
  data: function() {
    return {
      originalQuiz: {}, // original quiz to check if any changes were made in case of editing a quiz
      quiz: {
        ID: '',
        title: '',
        categoryID: '',
        questions: []
      },
      creating: false,
      submitted: false,
      quizCategoryNames: []
    }
  },
  computed: {

  },
  beforeRouteLeave(to, from, next) {
    if(!this.submitted && this.haveChangesBeenMade()) {
      this.$emit('showConfirmModal', {
        title: 'Discard changes?',
        message: 'You have unsaved changes that will be discarded, are you sure you want to leave?',
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
  created() {
    this.quizCategoryNames = [];
    for(const category of this.quizCategories)
      this.quizCategoryNames.push(category.categoryName);
  },
  mounted() {
    // if there is an ID as a parameter, then the intention is to edit an already existing quiz, otherwise we're
    // creating a new one
    this.creating = this.$route.params.id == null;

    if(!this.creating) {
      api.get('/quizdetails/' + this.$route.params.id)
        .then(response => response.json())
        .then(json => {
          this.quiz.ID = json.ID;
          this.quiz.title = json.title;
          this.quiz.categoryID = json.categoryID;

          for(const question of json.questions) {
            this.quiz.questions.push({
              ID: question.ID,
              question: question.question,
              correctAnswer: question.correct_answer,
              incorrectAnswers: [question.answer1, question.answer2, question.answer3]
            });
          }

          // deep copy
          this.originalQuiz = JSON.parse(JSON.stringify(this.quiz));

          // set category for the StyledSelect dropdown element
          this.$refs.styledSelect.select(this.getQuizCategoryNameByID(this.quiz.categoryID));
        });
    } else {
      // deep copy
      this.originalQuiz = JSON.parse(JSON.stringify(this.quiz));
    }
  },
  updated() {
    for(const textarea of document.getElementsByTagName('textarea')) {
      textarea.style.height = '5px';
      textarea.style.height = (textarea.scrollHeight)+"px";
    }
  },
  methods: {
    getQuizCategoryNameByID(ID) {
      for(const category of this.quizCategories)
        if(category.ID === ID)
          return category.categoryName;
    },
    onCategoryChanged(categoryName) {
      for(const category of this.quizCategories)
        if(categoryName === category.categoryName) {
          this.quiz.categoryID = category.ID;
          break;
        }
    },
    haveChangesBeenMade() {
      if(this.quiz.title !== this.originalQuiz.title)
        return true;

      if(this.quiz.questions.length !== this.originalQuiz.questions.length)
        return true;

      for(let i = 0; i < this.quiz.questions.length; i++) {
        let newQuestion = this.quiz.questions[i];
        let originalQuestion = this.originalQuiz.questions[i];

        if(newQuestion.question !== originalQuestion.question)
          return true;

        if(newQuestion.correctAnswer !== originalQuestion.correctAnswer)
          return true;

        for(let j = 0; j < 3; j++)
          if(newQuestion.incorrectAnswers[j] !== originalQuestion.incorrectAnswers[j])
            return true;
      }

      return false;
    },
    autoGrow(event) {
      event.target.style.height = '5px';
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
            // type: 'multichoice',
            correctAnswer: '',
            incorrectAnswers: []
          });
    },
    deleteQuestion(index) {
      this.$emit('showConfirmModal', {
        title: 'Delete following question?',
        message: 'Delete "' + this.quiz.questions[index].question + '"?',
        redButton: 'Delete',
        cancelButton: 'Cancel',
        callback: (ok) => {
          if(ok)
            this.quiz.questions.splice(index, 1);
        }
      });
    },
    submit() {
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
      let apiCall = this.creating ? api.postJson : api.putJson;
      apiCall('/quiz', this.quiz)
        .then(response => {
          this.submitted = true;
          if(response.status === 200) {
            this.$emit('showConfirmModal', {
              title: 'Quiz saved!',
              message: this.quiz.title + ' has been saved!',
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

td {
  padding: 6px;
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
  overflow: hidden;
  height: 25px;
}

textarea:focus {
  border-style: none;
  background-color: white;
  cursor: text;
}

#category-container {
  /*border: solid 1px black;*/
  width: max-content;
  margin: 20px auto;
}

/*#category-container select {*/
/*  margin: 10px;*/
/*  height: 35px;*/
/*  width: 155px;*/
/*  background-color: rgba(0, 162, 232, 0.8);*/
/*  color: white;*/
/*  border: none;*/
/*}*/

/*option {*/
/*  height: 35px;*/
/*}*/

/*#category-container label {*/
/*  display: none;*/
/*}*/

#category-container button {
  display: inline-block;
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

table tbody tr td:nth-child(6){
  padding-top: 0;
  padding-bottom: 0;
}

.general-container > div {
  margin: 10px auto;
  width: max-content;
}

div > button {
  margin: 10px auto;
  display: block;
}

</style>