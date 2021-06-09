<template>
  <div class="question-container">

    <div class="h2-container">
      <h2>{{ title }}</h2>
    </div>
    <h3 class="question-paragraph"> {{ question.question }} </h3>
    <form v-on:submit.prevent="" v-if="question.answers">
      <div class="radio-input-container" v-if="question.answers[0]" v-on:click="selected($event, question.ID)">
        <input type="radio" v-bind:id="question.ID + '_answer1'" name="quiz-name" v-bind:value="question.answers[0]">
        <label v-bind:for="question.ID + '_answer1'"> {{ question.answers[0] }} </label><br>
      </div>

      <div class="radio-input-container" v-if="question.answers[1]" v-on:click="selected($event, question.ID)">
        <input type="radio" v-bind:id="question.ID + '_answer2'" name="quiz-name" v-bind:value="question.answers[1]">
        <label v-bind:for="question.ID + '_answer2'"> {{ question.answers[1] }} </label><br>
      </div>

      <div class="radio-input-container" v-if="question.answers[2]" v-on:click="selected($event, question.ID)">
        <input type="radio" v-bind:id="question.ID + '_answer3'" name="quiz-name" v-bind:value="question.answers[2]">
        <label v-bind:for="question.ID + '_answer3'"> {{ question.answers[2] }}</label><br>
      </div>

      <div class="radio-input-container" v-if="question.answers[3]" v-on:click="selected($event, question.ID)">
        <input type="radio" v-bind:id="question.ID + '_answer4'" name="quiz-name" v-bind:value="question.answers[3]">
        <label v-bind:for="question.ID + '_answer4'"> {{ question.answers[3] }} </label><br>
      </div>
    </form>
    <div v-else class="textinput-container">
      <input placeholder="Enter answer" class="textinput" v-on:input="selected($event, question.ID)">
    </div>
  </div>
</template>

<script>
export default {
  name: "Question",
  props: ['question', 'questionIndex', 'title'],
  data: function() {
    return {
      selectedAnswerTarget: undefined,
      locked: false
    }
  },
  methods: {
    selected(event, id) {
      this.selectedAnswerTarget = event.currentTarget;
      if(event.target.value) {
        console.log(event.target.value);
        if(this.locked) {
          event.preventDefault();
        } else {
          this.locked = true;
          this.$emit('onSelected', id, event.target.value);
        }
      }
    },
    showAnswerResult(correct) {
      if(this.selectedAnswerTarget)
        this.selectedAnswerTarget.classList.add(correct ? 'right-answer' : 'wrong-answer');
      this.locked = true;
    },
    hideAnswerResult() {
      if(this.selectedAnswerTarget) {
        this.selectedAnswerTarget.classList.remove('right-answer');
        this.selectedAnswerTarget.classList.remove('wrong-answer');
      }
      this.locked = false;
    }
  }
}
</script>

<style scoped>
.h2-container {
  width: 100%;
  background-color: #F29544;
  padding: 5px;
  color: #fcfcfc;
}

.question-paragraph {
  text-align: center;
  font-size:20px;
  padding: 15px;
}

.question-container {
  width: 100%;
  background-color: white;
  border-radius: 2px;
  margin: 30px auto;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
}

.question-container h2 {
  margin: 0;
}

.question-container h3 {
  margin: 5px;
}

form {
  display: grid;
  grid-template-columns: 1fr;
  justify-content: center;
  /*grid-gap: 10px;*/
}

.radio-input-container label{
  width: 100%; /*140px*/
  text-align: center;
  user-select: none;
  line-break: anywhere;
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

input[type="radio"]:checked + label {
  background-color: #014055;
}

.wrong-answer label, .wrong-answer:hover label, .wrong-answer input[type="radio"]:checked + label {
  background-color: red;
}

.right-answer label, .right-answer:hover label, .right-answer input[type="radio"]:checked + label {
  background-color: #0f8e00;
}

@media screen and (min-width:670px) {
  .radio-input-container label{
    width: 140px;
  }

  form {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
}

</style>