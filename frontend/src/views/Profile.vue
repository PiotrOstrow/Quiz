<template>
  <div class="profile">
    <h1>Profile</h1>
    <main>
      <article>
        <p>Username: {{ user.username }}</p>
        <p>Name: {{ user.name }}</p>
        <p>E-mail: {{ user.email }}</p>
        <button>Change password</button>
      </article>
    </main>
  </div>

</template>

<script>
export default {
  name: "Profile.vue",
  props: {
    user: [Object]
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