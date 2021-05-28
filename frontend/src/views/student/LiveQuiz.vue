<template>
  <div id="main-container">
    <main>
      <div class="live-quiz-list-container" v-if="state === states.liveQuizList">
        <h1>Live quiz</h1>
        <p>Förklaring för livequiz här...</p>
        <input class="code-input" placeholder="Enter code here..." v-model="code"/>
        <button v-on:click="join">Join live quiz</button>
      </div>
      <div class="question-container" v-if="state === states.Question && quiz.questions.length > currentQuestionID - 1">
        <div class="h2-container">
          <h2>Question {{currentQuestionID+1}}/{{ quiz.questions.length }}</h2>
        </div>
        <h3 class="question-paragraph">{{quiz.questions[currentQuestionID].question}}</h3>
        <form>
          <div class="radio-input-container" v-on:click="selectAnswer($event)">
            <input type="radio" name="quiz-name">
            <label>{{ quiz.questions[currentQuestionID].answers[0] }}</label>
          </div>
          <div class="radio-input-container" v-on:click="selectAnswer($event)">
            <input type="radio" name="quiz-name">
            <label>{{ quiz.questions[currentQuestionID].answers[1] }}</label>
          </div>
          <div class="radio-input-container" v-on:click="selectAnswer($event)">
            <input type="radio" name="quiz-name">
            <label>{{ quiz.questions[currentQuestionID].answers[2] }}</label>
          </div>
          <div class="radio-input-container" v-on:click="selectAnswer($event)">
            <input type="radio" name="quiz-name">
            <label>{{ quiz.questions[currentQuestionID].answers[3] }}</label>
          </div>
        </form>
      </div>
      <div id="score-container" v-if="state === states.Leaderboard">
        <h2>Top 5 scores:</h2>
        <table class="blue-table">
          <thead>
          <tr>
            <th>Name</th>
            <th>Score</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>Murre</td>
            <td>50</td>
          </tr>
          </tbody>
        </table>
      </div>
    </main>

    <timer v-show="!this.isQuizOver() && state !== states.liveQuizList" ref="timer" id="timer"/>

  </div>
</template>

<script>
import Timer from '@/components/Timer.vue'
import api from '@/api.js'

export default {
  name: "LiveQuiz",
  components: {Timer},
  data: function () {
    return {
      quiz: {},
      currentQuestionID: 0,
      timePerQuestion: 10,
      timeForLeaderboard: 10,
      questionTimeOverTimeout: undefined, // timeout function ID that is called when a question has not been answered
      currentQuestionAnswered: false,
      states: {
        liveQuizList: 1,
        Question: 2,
        Leaderboard: 3,
        Finished: 4
      },
      state: undefined,
      code: ''
    }
  },
  mounted() {
    this.state = this.states.liveQuizList;
    api.getQuiz(1)
      .then(response => response.json())
      .then(json => {
        this.quiz = json;
        // setTimeout(() => this.startQuiz(), 1000);
      });
  },
  methods: {
    join() {
      // console.log('entered code ' + this.code);
    },
    startQuiz() {
      this.startQuestionTimer();
    },
    selectAnswer(event) {
      clearTimeout(this.questionTimeOverTimeout);

      if(!this.currentQuestionAnswered) {
        this.currentQuestionAnswered = true;
        event.target.classList.add(Math.random() > 0.5 ? 'right-answer' : 'wrong-answer');

        setTimeout(() => {
          event.target.classList.remove('right-answer');
          event.target.classList.remove('wrong-answer');
          this.currentQuestionAnswered = false;
          this.showLeaderboard();
        }, 2500);
      }
    },
    startQuestionTimer() {
      this.$refs.timer.start(this.timePerQuestion);
      this.questionTimeOverTimeout = setTimeout(() => {
        this.showLeaderboard();
      }, this.timePerQuestion * 1000);
    },
    showLeaderboard() {
      this.showingLeaderboard = true;

      if(!this.isQuizOver()) {
        this.currentQuestionID++;
        this.$refs.timer.start(this.timeForLeaderboard);

        setTimeout(() => {
          this.showingLeaderboard = false;
          this.startQuestionTimer();
        }, this.timeForLeaderboard * 1000);
      } else {
        this.$refs.timer.stop();
      }
    },
    isQuizOver() {
      return this.currentQuestionID >= this.quiz.questions.length;
    }
  }
}
</script>

<style scoped>
h1, h2, h3, p {
  text-align: center;
}

main {
  width: max-content;
  margin: 0 auto;
}

.quiz-navigation {
  margin: auto;
}

.question-container {
  width: 100%;
  background-color: white;
  border-radius: 2px;
  margin: 30px auto;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
}

.question-container h2{
  margin: 0;
  padding: 5px;
}

.h2-container {
  width: 100%;
  background-color: #F29544;
  color: #fcfcfc;
  margin: 0;
}

.question-paragraph {
  text-align: center;
  font-size: 20px;
  padding: 15px;
}

form {
  display: flex;
  justify-content: center;
}

#main-container {
  position: relative;
  height: 100%;
}

#timer {
  position: absolute;
  top: 10px;
  right: 50px;
}

main {
  display: flex;
  justify-content: center;
  flex-direction: column;
  height: 100%;
}

.question-container {
}

#score-container {
  padding-bottom: 100px;
}

.wrong-answer, .wrong-answer:hover {
  background-color: red;
}

.right-answer, .right-answer:hover {
  background-color: #0f8e00;
}

.code-input {
  padding: 8px;
  font-size: 28px;
  text-align:center;
}

.live-quiz-list-container {
  padding-bottom: 200px;
}

.live-quiz-list-container * {
  display: block;
}

.live-quiz-list-container button {
  margin: 20px auto;
  display:block;
  width: 200px;
  height: 50px;
  font-size: 24px;
}

</style>