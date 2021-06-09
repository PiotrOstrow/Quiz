<template>
  <div class="live-quiz-container">
    <div v-if="state === states.List" class="inner-container">
      <h1>Start a live quiz</h1>
      <p>Förklaring på livequiz här...</p>

      <table v-show="quizList.length > 0" class="blue-table" id="quiz-table">
        <thead>
        <tr>
          <th>Name</th>
          <th>Category</th>
          <th>Questions</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(quiz, index) of liveQuizList" v-bind:key="index">
          <td>{{ quiz.title }}</td>
          <td>{{ quiz.categoryName }}</td>
          <td>{{ quiz.questionCount }}</td>
          <td><button v-on:click="initQuiz(quiz.ID)">Start</button></td>
        </tr>
        </tbody>
      </table>
    </div>

    <div v-if="state === states.SplashScreen" class="inner-container">

      <h1>Participants joined: {{ participants.length }}</h1>
      <h3>To participate, enter code:</h3>
      <h1>{{ code }}</h1>
      <p id="participant-list">{{participantNameList}}</p>
      <button id="submit-button" v-on:click="startQuiz">Start quiz</button>

  <!--    <p v-for="(participant, index) of participants" v-bind:key="index" v-bind:style="{top:participant.y + 'px', right: participant.x + 'px', position:'absolute'}">-->
  <!--      {{ participant.name + ' ' + participant.x + ', ' + participant.y}}-->
  <!--    </p>-->

    </div>
    <div v-if="state === states.Question" class="inner-container">
      <h1>{{ quiz.questions[currentQuestionIndex].question }}</h1>
      <h2> Answers: {{ answerCount }}/{{ participants.length }}</h2>
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
        <tr v-for="(user, index) of leaderboard" v-bind:key="index">
          <td>{{ user.name }}</td>
          <td>{{ user.score }}</td>
        </tr>
        </tbody>
      </table>
    </div>

    <div v-if="state === states.Finished">
      <FinalLeaderboard :leaderboard="leaderboard"/>
    </div>

    <Timer v-show="state === states.Question || state === states.Leaderboard" ref="timer" id="timer"/>

  </div>
</template>

<script>

import api from '@/api.js';
import Timer from '@/components/Timer.vue';
import FinalLeaderboard from '@/components/FinalLeaderboard.vue'

export default {
  name: "LiveQuiz",
  components: { Timer, FinalLeaderboard },
  props: ['quizList'],
  data: function() {
    return {
      participants: [],
      quiz: {},
      currentQuestionIndex: 0,
      states: {
        List: 5,
        SplashScreen: 1,
        Question: 2,
        Leaderboard: 3,
        Finished: 4
      },
      state: undefined,
      socket: undefined,
      timePerQuestion: 60 * 60,
      timeForLeaderboard: 5,
      code: undefined,
      answerCount: 0,
      leaderboard: []
    }
  },
  computed: {
    participantNameList() {
      let list = '';
      for(const participant of this.participants)
        list += participant.name + ', ';

      list = list.substr(0, list.length - 2);
      return list;
    },
    liveQuizList() {
      let list = [];
      for(const quiz of this.quizList)
        if(quiz.isLiveQuiz)
          list.push(quiz);
      return list;
    }
  },
  beforeMount() {
    window.addEventListener("beforeunload", this.onBeforeUnload)
  },
  beforeRouteLeave(to, from, nextOriginal) {
    let next = () => {
      window.removeEventListener('beforeunload', this.onBeforeUnload);
      this.socket.close();
      nextOriginal();
    }

    if(!this.isQuizOver() && this.state !== this.states.List && to.path !== '/') {
      this.$emit('showConfirmModal', {
        title: 'Leave live quiz?',
        message: 'Live quiz will be cancelled, are you sure you want to leave?',
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
  mounted() {
    this.state = this.states.List;

    // Create WebSocket connection.
    this.socket = new WebSocket('ws://185.181.10.135:3000');

    // Connection opened
    // eslint-disable-next-line no-unused-vars
    this.socket.addEventListener('open', (event) => {
    });

    // Listen for messages
    this.socket.addEventListener('message', this.onMessageReceived);

    // let handler = () => {
    //   // let radius = 200;
    //   this.participants.push({
    //     name: 'Participant #' + this.participants.length,
    //     // x: Math.round(Math.cos(this.participants.length * Math.PI * 2 / 20) * radius),
    //     // y: Math.round(Math.sin(this.participants.length * Math.PI * 2 / 20) * radius)
    //     // x: Math.round(window.innerWidth * Math.random()),
    //     // y: Math.round(window.innerHeight * 0.75 * Math.random())
    //   });
    //   if(this.participants.length < 20)
    //     setTimeout(handler, Math.random() * 1000);
    // }
    // setTimeout(handler, 1000);
  },
  methods: {
    onBeforeUnload(event) {
      if(!this.isQuizOver() && this.state !== this.states.List)
        return;

      event.preventDefault()
      // Chrome requires returnValue to be set.
      event.returnValue = ""
    },
    onMessageReceived(event) {
      const data = JSON.parse(event.data);

      console.log(data);

      if(data.error) {
        this.$emit('showConfirmModal', {
          title: 'Error',
          message: data.error,
          okButton: 'Ok'
        });
        return;
      }

      switch(data.reply) {
        case 'initialized':
          this.timePerQuestion = data.timePerQuestion;
          this.timeForLeaderboard = data.timeForLeaderboard;
          this.state = this.states.SplashScreen;
          break;
        case 'started':
          this.currentQuestionIndex = -1;
          this.nextQuestion();
          break;
        case 'answer':
            this.answerCount = data.count;
          break;
        case 'leaderboard':
          this.state = this.isQuizOver() ? this.states.Finished : this.states.Leaderboard;
          this.leaderboard = data.leaderboard;
          this.$refs.timer.start(this.timeForLeaderboard);
          break;
        case 'next':
            // this.currentQuestionIndex++;
            // this.state = this.states.Question;
          this.nextQuestion();
          break;
      }

      if(data.participants)
        this.participants = data.participants;
    },
    initQuiz(quizID) {
      this.$emit('showInputModal', {
        title: 'Enter quiz code',
        message: 'Enter the code that your students will need to provide to join the quiz',
        inputs: [{type: 'text', placeholder: 'Quiz code'}],
        okButton: 'Start Quiz',
        cancelButton: 'Cancel',
        callback: (inputs) => {
          if(inputs) {
            api.get('/quizdetails/' + quizID)
                .then(response => response.json())
                .then(json => {
                  this.quiz = json;
                  this.code = inputs[0];
                  this.socket.send(JSON.stringify({ action: 'init', quizID: quizID, code: this.code }));
                });
          }
        }
      })
    },
    startQuiz() {
      this.socket.send(JSON.stringify({action: 'start', code: this.code}))
    },
    showLeaderboard() {
      this.state = this.states.Leaderboard;
      this.$refs.timer.start(this.timeForLeaderboard, () => {
        this.nextQuestion();
      });
    },
    nextQuestion() {
      this.currentQuestionIndex++;
      this.state = this.states.Question;
      this.$refs.timer.start(this.timePerQuestion);
      this.answerCount = 0;
    },
    onQuizFinished() {
      this.state = this.states.Finished;
    },
    isQuizOver() {
      return this.quiz.questions && this.currentQuestionIndex >= this.quiz.questions.length - 1;
    }
  }
}
</script>

<style scoped>
h1, h2, h3, p {
  text-align:center;
}

.live-quiz-container {
  display: flex;
  justify-content: center;
  flex-direction: column;
  min-height: calc(100vh - var(--header-height) - var(--nav-height) - var(--footer-height));

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

</style>