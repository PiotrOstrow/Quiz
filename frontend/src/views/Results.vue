<template>
  <section class="grid-container">
<div class="results">
  <h1 class="underlineTitle">Results</h1>
  <main>
    <div class="article-container">
    <article>
      <div class="underlineSubjectTitle">
      <h2>Math</h2>
      </div>
      <!--      Example text-->
      <p>You got 0 out of 10 correct.</p>
    </article>
    </div>
    <div class="article-container">
    <article>
      <div class="underlineSubjectTitle">
      <h2>Geography</h2>
      </div>
      <!--      Example text-->
      <p>You guessed wrong on Sweden's capital.</p>
    </article>
    </div>
  </main>

</div>
  </section>

</template>

<script>
export default {
  name: "Results.vue"
}
</script>
<style scoped>

body {
  background-color: lightgrey;
}

section {
  display: flex;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto auto 50px;
  grid-template-areas: "header" "navigation" "main-content" "footer";
  grid-gap: 50px;
}

section.grid-container {
  width: 600px;
  margin: 15px auto;
}

main {
  grid-area: main-content;
  display: flex;
  grid-template-columns: 1fr;
  grid-gap: 20px;
}

.underlineTitle {
  font-size: 36px;
}

.underlineSubjectTitle {
  border-bottom: 2px solid #00a2e8;
  margin: 10px;

}

.article-container {
  width: 100%;
  border-radius: 20px;
  padding: 1%;
  background-color: white;
}

</style>