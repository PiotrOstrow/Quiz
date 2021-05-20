<template>
  <div class="profile">
    <h1>Profile</h1>
    <main>
      <article>
        <p>Username: {{ user.username }}</p>
        <p>Name: {{ user.name }}</p>
        <p>E-mail: {{ user.email }}</p>
        <button @click="changePassword">Change password</button>
      </article>
    </main>
  </div>

</template>

<script>

import api from '../api.js'

export default {
  name: "Profile.vue",
  props: {
    user: [Object]
  },
  methods: {
    changePassword() {
      this.$emit('showInputModal', {
        title: 'Change password',
        inputs: [
          {type: 'password', placeholder: 'Current password...'},
          {type: 'password', placeholder: 'New password...'},
          {type: 'password', placeholder: 'Repeat new password...'}
        ],
        okButton: 'Change',
        cancelButton: 'Cancel',
        callback: (result) => {
          if(result) {

            let json = {
              currentPassword: result[0],
              newPassword: result[1],
              newPasswordRepeated: result[2]
            }

            api.postJson('/change-password', json)
              .then(response =>  response.json())
              .then(json => {
                // let json = await response.json();
                this.$emit('showConfirmModal', {
                  title: json.msg,
                  // message: json.msg,
                  okButton: 'ok'
                });
              });
          }
        }
      });
    }
  }
}
</script>

<style scoped>

/*section {*/
/*  display: grid;*/
/*  grid-template-columns: 1fr;*/
/*  grid-template-rows: auto auto auto 50px;*/
/*  grid-gap: 20px;*/
/*}*/

.profile{
  width: 200px;
  margin: auto;
}
h1{
  font-size: 40px;
}

</style>