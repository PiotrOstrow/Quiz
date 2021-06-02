<template>
  <div class="quiz">
    <main>
      <h1>My Quizzes</h1>

      <div id="category-container">
        <div class="radio-input-container" v-for="category of quizCategories" v-bind:key="category.ID">
          <input type="radio" name="category" v-bind:id="category.ID" v-bind:value="category.ID" v-on:click="setCategory($event, category.ID)">
          <label v-bind:for="category.ID">{{ category.categoryName }}</label>
        </div>
      </div>
      <div class="quizzes-container">
        <div v-for="quiz in quizListFiltered" v-bind:key="quiz.ID" class="quiz-element">
          <div class="quiz-element-titlediv">
            <h3>{{ quiz.title }}</h3>
          </div>
          <p>Questions: {{ quiz.question_count }}</p> <p> {{ quiz.maxScore ? 'Score:' +  quiz.maxScore+ '/' + quiz.question_count : 'No score yet' }} </p>
          <div class="button-container">
            <button v-on:click="$router.push('/student/quiz/' + quiz.ID)">Start quiz</button>
            <button v-on:click="$router.push('/student/quiz-overview/' + quiz.ID)">Scores</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import api from '../../api.js';
export default {
  name: "Home-student.vue",
  props: {
    quizList: [Array, Object],
    quizCategories: [Array],
  },
  data: function() {
    return {
      selectedCategory: 0,
      quizScore: []
    }
  },
  methods: {
    setCategory(event, ID) {
      if(this.selectedCategory === ID) {
        this.selectedCategory = 0;
        event.target.checked = false;
      } else {
        this.selectedCategory = ID;
      }
    }
  },
  computed: {
    quizListFiltered() {
      if(this.selectedCategory === 0)
        return this.quizScore;

      let filtered = [];
      for(const quiz of this.quizScore)
        if(quiz.categoryID === this.selectedCategory)
          filtered.push(quiz);

      return filtered;
    }
  },
  mounted() {
      api.get('/student-home-results-for-each-quiz/')
          .then(response => response.json())
          .then(json => this.quizScore = json);
  }
}
</script>

<style scoped>

h1 {
  font-size: 40px;
  text-align: center;
}

h3 {
  margin: 2px;
}

main {
  width: max-content;
}

.quiz {
  width: min-content;
  display: block;
  margin: auto;
}

.quizzes-container {
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 20px;
  width: max-content;
  margin: 0 auto;
}

.quiz-element {
  /*display: flex;*/
  /*flex-direction: column;*/
  text-align: center;
  width: 275px;
  height: 150px;
  background-color: white;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  border-radius: 2px;
  justify-content: space-evenly;
  align-items: center;
  position: relative;
}

.quiz-element p {
  display: inline-block;
  margin: 15px;
}

.quiz-element-titlediv {
  display: block;
  border-bottom: solid 1px;
  font-family:Pangolin, sans-serif;
  text-align: center;
  font-size: 22px;
  font-weight: bold;
  background-color: #00a2e8;
  color: white;
  padding: 10px;
  cursor: pointer;
}

.button-container {
  width: 100%;
  height: max-content;
  position: absolute;
  bottom: 0;

}

.button-container button {
  margin: 10px;
}

#category-container {
  margin: 0 auto;
  display: flex;
  justify-content: center;
  border-bottom: solid 2px #00a2e8;
  width: 100%;
}

.radio-input-container label {
  width: max-content;
  color: #2c3e50;
  background-color: transparent;
}

.radio-input-container label:hover {
  background-color: rgba(0, 162, 232, 0.8);
  color:white;
}

.radio-input-container input[type="radio"]:checked + label {
  background-color: #2c3e50;
  color:white;
}

.radio-input-container {
  display: inline-block;
}

.radio-input-container + .radio-input-container {
  margin-left: 10px;
}

@media screen and (min-width: 620px) and (max-width: 921px) {
  .quizzes-container {
    padding: 20px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;
    /*width: 500px;*/
    margin: 0 auto;
  }
}


@media screen and (min-width:922px) {
  .quizzes-container {
    padding: 20px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 20px;
    /*width: 500px;*/
    margin: 0 auto;
  }
}

</style>
