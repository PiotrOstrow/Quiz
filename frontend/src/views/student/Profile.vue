<template>
  <div class="profile">
    <h1>Profile</h1>
    <main>
      <article>
        <p><b>Username:</b> {{ user.username }}</p>
        <p><b>Name:</b> {{ user.name }}</p>
        <p><b>E-mail:</b> {{ user.email }}</p>
        <div class="change-password-button">
          <button @click="changePassword">Change password</button>
        </div>
      </article>
    </main>
  </div>

</template>

<script>

import api from '../../api.js'

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
          if (result) {

            let json = {
              currentPassword: result[0],
              newPassword: result[1],
              newPasswordRepeated: result[2]
            }

            api.postJson('/change-password', json)
                .then(response => response.json())
                .then(json => {
                  this.$emit('showConfirmModal', {
                    title: json.msg,
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

.profile {
  width: 200px;
  margin: auto;
}

h1 {
  font-size: 40px;
  text-align: center;
}

.change-password-button {
  text-align: center;
}

</style>