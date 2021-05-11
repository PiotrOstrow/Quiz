<template>
  <div>
    <h1>Create quiz</h1>
    <div class="general-container">
      <div>
        <label for="title">Title: </label>
        <input type="text" id="title">
      </div>

      <div>
        <label for="timed">Timed </label>
        <input type="checkbox" id="timed">
      </div>

      <div>
        <label for="timelimit">Time limit </label>
        <input type="time" id="timelimit">
      </div>

    </div>

    <div class="general-container" v-for="(question, index) in questions" v-bind:key="index">
      <div>
        <label> Title: </label>
        <input v-model="question.question">
      </div>

      <div>
        <label> Type: </label>
        <select v-model="question.type">
          <option value="multichoice">Multi-choice</option>
          <option value="truefalse">True or false</option>
          <option value="textinput">Text input</option>
        </select>
      </div>


      <div v-if="question.type === 'multichoice'">
        <label> Answer1: </label>
        <input v-model="question.answer1">
      </div>
      <div v-if="question.type === 'multichoice'">
        <label> Answer2: </label>
        <input v-model="question.answer2">
      </div>
      <div v-if="question.type === 'multichoice'">
        <label> Answer3: </label>
        <input v-model="question.answer3">
      </div>
      <div v-if="question.type === 'multichoice'">
        <label> Answer4: </label>
        <input v-model="question.answer4">
      </div>

      <div v-if="question.type === 'truefalse'">
        <input type="radio" id="test1">
        <label for="test1">True</label>
      </div>
      <div v-if="question.type === 'truefalse'">
        <input type="radio" id="test1">
        <label for="test1">True</label>
      </div>

      <div>
        <label> Correct answer: </label>
        <input v-model="question.answer4">
      </div>

    </div>

    <button v-on:click="addQuestion">Add question</button>

  </div>
</template>

<script>
export default {
  name: "Create-quiz",
  data: function() {
    return {
      questions: []
    }
  },
  methods: {
    addQuestion() {
      this.questions.push(
          {
            question: '',
            type: 'multichoice'
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