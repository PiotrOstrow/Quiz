<template>
  <div>
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
        <td><button v-on:click="startQuiz(quiz.ID)">Start</button></td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "LiveQuizList",
  props: ['quizList'],
  computed: {
    liveQuizList() {
      let list = [];
      for(const quiz of this.quizList)
        if(quiz.isLiveQuiz)
          list.push(quiz);
      return list;
    }
  },
  methods: {
    startQuiz(quizID) {
      this.$emit('showInputModal', {
        title: 'Enter quiz code',
        message: 'Enter the code that your students will need to provide to join the quiz',
        inputs: [{type: 'text', placeholder: 'Quiz code'}],
        okButton: 'Start Quiz',
        cancelButton: 'Cancel',
        callback: (ok) => {
          if(ok) {
            this.$router.push('/teacher/live/' + quizID);
          }
        }
      })
    }
  }
}
</script>

<style scoped>
h1, h2, h3, p {
  text-align: center;
}

</style>