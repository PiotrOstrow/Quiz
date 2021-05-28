<template>
<div id="container">
  <div v-if="state === states.SplashScreen" class="inner-container">

    <h1>Participants joined: {{ participants.length }}</h1>
    <p id="participant-list">{{participantNameList}}</p>
    <button id="submit-button" v-on:click="startQuiz">Start quiz</button>

<!--    <p v-for="(participant, index) of participants" v-bind:key="index" v-bind:style="{top:participant.y + 'px', right: participant.x + 'px', position:'absolute'}">-->
<!--      {{ participant.name + ' ' + participant.x + ', ' + participant.y}}-->
<!--    </p>-->

  </div>
  <div v-if="state === states.Question" class="inner-container">
    <h1>{{ quiz.questions[currentQuestionIndex].question }}</h1>
    <h2> Answers: 2/12</h2>
  </div>

  <div v-if="state === states.Leaderboard">
    <h1>{{ quiz.questions[currentQuestionIndex].question }}</h1>

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

  <div v-if="state === states.Finished" id="finished-container">
    <h1>Quiz finished</h1>


    <div class="final-score-row"><img id="gold-medal"   src="https://img.icons8.com/emoji/48/000000/1st-place-medal-emoji.png"> <h1>Abc</h1></div>
    <div class="final-score-row"><img id="silver-medal" src="https://img.icons8.com/emoji/48/000000/2nd-place-medal-emoji.png"> <h2>Xyz</h2></div>
    <div class="final-score-row"><img id="bronze-medal" src="https://img.icons8.com/emoji/48/000000/3rd-place-medal-emoji.png"> <h3>Bob</h3></div>
  </div>

  <Timer v-show="state === states.Question || state === states.Leaderboard" ref="timer" id="timer"/>

</div>
</template>

<script>

import api from '@/api.js';
import Timer from '@/components/Timer.vue';

export default {
  name: "LiveQuiz",
  components: { Timer },
  data: function() {
    return {
      participants: [],
      quiz: {},
      currentQuestionIndex: 0,
      states: {
        SplashScreen: 1,
        Question: 2,
        Leaderboard: 3,
        Finished: 4
      },
      state: undefined
    }
  },
  computed: {
    participantNameList() {
      let list = '';
      for(const participant of this.participants)
        list += participant.name + ', ';

      list = list.substr(0, list.length - 2);
      return list;
    }
  },
  mounted() {
    this.state = this.states.SplashScreen;

    api.get('/quizdetails/1')
      .then(response => response.json())
      .then(json => {
        this.quiz = json
        //temporary
        // this.startQuiz();
      });

    let handler = () => {
      // let radius = 200;
      this.participants.push({
        name: 'Participant #' + this.participants.length,
        // x: Math.round(Math.cos(this.participants.length * Math.PI * 2 / 20) * radius),
        // y: Math.round(Math.sin(this.participants.length * Math.PI * 2 / 20) * radius)
        // x: Math.round(window.innerWidth * Math.random()),
        // y: Math.round(window.innerHeight * 0.75 * Math.random())
      });
      if(this.participants.length < 20)
        setTimeout(handler, Math.random() * 1000);
    }
    setTimeout(handler, 1000);
  },
  methods: {
    startQuiz() {
      this.currentQuestionIndex = -1;
      this.nextQuestion();
    },
    showLeaderboard() {
      this.state = this.states.Leaderboard;
      this.$refs.timer.start(3, () => {
        this.nextQuestion();
      });
    },
    nextQuestion() {
      this.currentQuestionIndex++;
      this.state = this.states.Question;
      this.$refs.timer.start(3, () => {
        if(this.currentQuestionIndex === this.quiz.questions.length - 1)
          this.onQuizFinished();
        else
          this.showLeaderboard();
      });
    },
    onQuizFinished() {
      this.state = this.states.Finished;
    }
  }
}
</script>

<style scoped>
h1, h2, h3 {
  text-align:center;
}

#container {
  display: flex;
  justify-content: center;
  flex-direction: column;
  height: 100%;
  position:relative;
}

.inner-container {
  width: max-content;
  height: max-content;
  /*border: solid 1px black;*/
  margin: 0 auto;
  padding-bottom: 100px;
  /*position:relative;*/
}

#submit-button {
  margin: 20px auto;
  display:block;
  width: 200px;
  height: 50px;
  font-size: 24px;
  /*border: solid 2px black;*/
}

#participant-list {
  max-width: 500px;
  text-align: center;
  margin: 0 auto;
}

#timer {
  position: absolute;
  top: 50px;
  right: 50px;
}

#finished-container{
  width: max-content;
  margin: 0 auto;
}

.final-score-row {
  width: max-content;
  /*margin: 0 auto;*/
  display: flex;
  justify-content: center;
  align-items: center;
}

.final-score-row * {
  display: inline;
}

#gold-medal {
  /*width: 72px;*/
}

#silver-medal {
  width: 42px;
}

#bronze-medal {
  width: 36px;
}

</style>