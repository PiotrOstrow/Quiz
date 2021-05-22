<template>
  <div id="main-container">
    <h1> WELCOME TEACHERS :) </h1>

    <div id="grid-container">
      <div class="inner-container">
        <h2> Your students: </h2>
        <h3 v-show="users.length === 0">No students have registered yet</h3>
        <table v-show="users.length > 0" class="blue-table">
          <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(student, index) in users" v-bind:key="index" v-on:click="$router.push('/student-overview/' + student.ID)">
            <td>{{ student.ID }}</td>
            <td>{{ student.name }}</td>
            <td>{{ student.username }}</td>
            <td>{{ student.email }}</td>
          </tr>
          </tbody>
        </table>
      </div>

      <div class="inner-container">
        <h2> Quizzes: </h2>
        <h3 v-show="quizList.length === 0">No quizzes have been created yet</h3>
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
          <tr v-for="(quiz, index) in quizList" v-bind:key="index" v-on:click="$router.push('/quiz-overview/' + quiz.ID)">
            <td>{{ quiz.title }}</td>
            <td>{{ quiz.categoryName }}</td>
            <td>{{ quiz.questionCount }}</td>
            <td>
              <button class="icon-button" v-on:click.stop="editQuiz(quiz.ID)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                </svg>
              </button>
              <button class="icon-button" v-on:click.stop="deleteQuiz(quiz.ID)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                  <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                </svg>
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home-teacher.vue",
  props: ['quizList', 'users', 'quizCategories'],
  methods: {
    editQuiz(id) {
      this.$router.push('/teacher/create/' + id);
    },
    deleteQuiz(id) {
      // find quiz by id
      let quiz;
      for(const q of this.quizList){
        if(q.ID === id){
          quiz = q;
          break;
        }
      }

      this.$emit('showConfirmModal', {
        title: 'Delete quiz?',
        message: 'Are you sure you want to delete quiz "' + quiz.title + '"?',
        redButton: 'Delete',
        cancelButton: 'Cancel',
        callback: (ok) => {
          if(ok)
            this.$emit('deleteQuiz', quiz.ID);
        }
      });
    }
  }
}
</script>

<style scoped>
h1, h2, h3, p {
  text-align: center;
}

#grid-container {
  width: max-content;
  margin: 0 auto;
}

#quiz-table tbody tr td:nth-child(4){
  padding-top: 0;
  padding-bottom: 0;
}

/*td, th {*/
/*  word-wrap: anywhere;*/
/*  white-space: nowrap;*/
/*  overflow: hidden;*/
/*}*/

/* Extra large devices (large laptops and dvbnhjjhg, esktops, 1200px and up) */
@media only screen and (min-width: 1200px) {
  #grid-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 50px;
  }
}

</style>