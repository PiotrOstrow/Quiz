<template>
  <div id="main-container">
    <main>
      <div class="live-quiz-list-container" v-if="state === states.liveQuizList">
        <h1>Live quiz</h1>
        <p>
          Your teacher will provide you with a code to join a live quiz.
          Once all students have joined, the quiz will start!
        </p>
        <p>
          Have fun and good luck!
        </p>
        <input class="code-input" placeholder="Enter code here..." v-model="code"/>
        <button v-on:click="join">Join live quiz</button>
      </div>

      <div v-if="state === states.SplashScreen" class="inner-container">
<!--        TODO: move to component? -->
        <h1>Participants joined: {{ participants.length }}</h1>
        <p id="participant-list">{{participantNameList}}</p>
        <p>Waiting for teacher to start the quiz...</p>

      </div>

      <Question
          ref="question"
          v-if="state === states.Question && quiz.questions.length > currentQuestionID - 1"
          :question="quiz.questions[currentQuestionID]"
          :questionIndex="currentQuestionID"
          :title="'Question' + (currentQuestionID + 1) + '/' + quiz.questions.length"
          v-on:selected="selectAnswer"/>

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
            <tr v-for="(user, index) of leaderboard" v-bind:key="index">
              <td>{{ user.name }}</td>
              <td>{{ user.score }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="state === states.Finished" >
        <FinalLeaderboard :leaderboard="leaderboard"/>
        <h3 v-if="getOwnScoreIfNotInTopThree">
          #{{getOwnScoreIfNotInTopThree.placement}} {{getOwnScoreIfNotInTopThree.name}} - {{ getOwnScoreIfNotInTopThree.score }} Points
        </h3>
      </div>
    </main>

    <timer v-show="state === states.Question || state === states.Leaderboard" ref="timer" id="timer"/>

  </div>
</template>

<script>
import Timer from '@/components/Timer.vue'
import FinalLeaderboard from '@/components/FinalLeaderboard.vue'
import Question from '@/components/Question.vue';
import api from '@/api.js'

export default {
  name: "LiveQuiz",
  components: { Timer, FinalLeaderboard, Question },
  props: ['user'],
  data: function () {
    return {
      quiz: {},
      currentQuestionID: 0,
      timePerQuestion: 60 * 60,
      timeForLeaderboard: 5,
      currentQuestionAnswered: false,
      states: {
        liveQuizList: 1,
        SplashScreen: 2,
        Question: 3,
        Leaderboard: 4,
        Finished: 5
      },
      state: undefined,
      code: '',
      socket: undefined,
      participants: [],
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
    getOwnScoreIfNotInTopThree() {
      for(let i = 0; i < this.leaderboard.length; i++) {
        if(this.leaderboard[i].ID === this.user.ID) {
          if(i < 3)
            return undefined;
          return {
            name: this.leaderboard[i].name,
            score: this.leaderboard[i].score,
            placement: i + 1
          }
        }
      }
      return undefined;
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

    if(to.path !== '/' && this.state !== this.states.liveQuizList && this.state !== this.states.Finished) {
      this.$emit('showConfirmModal', {
        title: 'Leave live quiz?',
        message: 'Are you sure you want to leave?',
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
    this.state = this.states.liveQuizList;
    // api.getQuiz(5)
    //     .then(response => response.json())
    //     .then(json => {
    //       this.quiz = json;
    //       // setTimeout(() => this.startQuiz(), 1000);
    //     });

    this.socket = new WebSocket('ws://' + window.location.hostname + ':3000');

    // Connection opened
    // eslint-disable-next-line no-unused-vars
    this.socket.addEventListener('open', (event) => {
    });

    // Listen for messages
    this.socket.addEventListener('message', this.onMessageReceived);
  },
  methods: {
    onBeforeUnload(event) {
      if(this.state === this.states.liveQuizList || this.state === this.states.Finished)
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
        case 'joined':
          this.state = this.states.SplashScreen;
          this.currentQuestionID = 0;
          this.timePerQuestion = data.timePerQuestion;
          this.timeForLeaderboard = data.timeForLeaderboard;
          api.getQuiz(data.quizID)
              .then(response => response.json())
              .then(json => {
                this.quiz = json;
                // setTimeout(() => this.startQuiz(), 1000);
              });
          break;
        case 'started': this.startQuiz(); break;
        case 'answer':
          this.$refs.question.showAnswerResult(data.correct);
          break;
        case 'leaderboard':
          this.$refs.question.hideAnswerResult();
          this.currentQuestionAnswered = false;
          this.state = this.isQuizOver() ? this.states.Finished : this.states.Leaderboard;
          this.leaderboard = data.leaderboard;

          if(!this.isQuizOver()) {
            this.$refs.timer.start(this.timeForLeaderboard);
          } else {
            this.$refs.timer.stop();
          }
          break;
        case 'next':
          this.currentQuestionID++;
          this.state = this.states.Question;
          this.currentQuestionAnswered = false;
          this.$refs.timer.start(this.timePerQuestion);
          break;
        case 'cancelled':
          this.$emit('showConfirmModal', {
            title: 'Quiz cancelled',
            message: 'Your teacher has cancelled the quiz',
            okButton: 'Ok',
            callback: () => {
              this.state = this.states.liveQuizList;
            }
          });
          break;
      }

      if(data.participants)
        this.participants = data.participants;

    },
    join() {
      // console.log('entered code ' + this.code);
      this.socket.send(JSON.stringify({
        action: 'join',
        code: this.code
      }));
    },
    startQuiz() {
      this.state = this.states.Question;
      this.$refs.timer.start(this.timePerQuestion);
    },
    selectAnswer(id, value) {
      if(!this.currentQuestionAnswered) {
        this.currentQuestionAnswered = true;

        this.socket.send(JSON.stringify({
          action: 'answer',
          answer: value
        }));
      }
    },
    isQuizOver() {
      return this.quiz.questions && this.currentQuestionID >= this.quiz.questions.length - 1;
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

.question-container h2 {
  margin: 0;
}

.question-container h3 {
  margin: 5px;
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


#main-container {
  position: relative;
  min-height: calc(100vh - var(--header-height) - var(--nav-height) - var(--footer-height));
  display: flex;
  justify-content: center;
  flex-direction: column;
}

#timer {
  position: absolute;
  top: 10px;
  right: 10px;
}

main {
  display: flex;
  justify-content: center;
  flex-direction: column;
  height: 100%;
}

#score-container {
  padding-bottom: 100px;
}

.code-input {
  padding: 8px;
  font-size: 28px;
  text-align:center;
  width: 280px;
  margin: 10px auto;
}

.live-quiz-list-container {
  padding-bottom: 200px;
  width: 100%;
}

.live-quiz-list-container * {
  display: block;
}

.live-quiz-list-container p {
  width: 300px;
  word-wrap: break-word;
  line-break: normal;
  margin: 10px auto;

}

.live-quiz-list-container button {
  margin: 20px auto;
  display:block;
  width: 200px;
  height: 50px;
  font-size: 24px;
}

.inner-container p {
  max-width: 300px;
}

@media screen and (min-width:670px) {
  .code-input {
    padding: 8px;
    font-size: 28px;
    text-align:center;
  }


  .live-quiz-list-container p {
    width: auto;
    max-width: 500px;
  }

  .inner-container p {
    max-width: 500px;
  }

  #timer {
    position: absolute;
    top: 10px;
    right: 50px;
  }
}

</style>