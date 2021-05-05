<template>
  <section class= grid-container>
  <div class="profile">
    <h1>Profile</h1>
    <main>
      <article>
        <p>Username:</p>
        <p>Name:</p>
        <p>E-mail:</p>
        <p>Birthdate:</p>
      </article>
    </main>
  </div>
  </section>


</template>

<script>
export default {
  name: "Profile.vue"
}
</script>

<style scoped>

section {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto auto auto 50px;
  grid-gap: 20px;
}

section.grid-container {
  width: 200px;
  margin: auto;
}
h1{
  font-size: 40px;
}

</style>