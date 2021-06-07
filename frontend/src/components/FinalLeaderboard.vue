<template>
  <div id="finished-container">
    <h1>Quiz finished</h1>


    <div class="final-score-row" v-if="leaderboard.length > 0">
      <img id="gold-medal"   src="https://img.icons8.com/emoji/48/000000/1st-place-medal-emoji.png">
      <h2>{{ leaderboard[0].name }}</h2>
      <h3>{{ leaderboard[0].score }} Points</h3>
    </div>
    <div class="final-score-row" v-if="leaderboard.length > 1">
      <img id="silver-medal" src="https://img.icons8.com/emoji/48/000000/2nd-place-medal-emoji.png">
      <h2>{{ leaderboard[1].name }}</h2>
      <h3>{{ leaderboard[1].score }} Points</h3>
    </div>
    <div class="final-score-row" v-if="leaderboard.length > 2">
      <img id="bronze-medal" src="https://img.icons8.com/emoji/48/000000/3rd-place-medal-emoji.png">
      <h2>{{ leaderboard[2].name }}</h2>
      <h3>{{ leaderboard[2].score }} Points</h3>
    </div>
  </div>
</template>

<script>
export default {
  name: "FinalLeaderboard",
  props: ['leaderboard']
}
</script>

<style scoped>
h1 {
  text-align: center;
}

h2 {
  margin: 0;
}

h3 {
  margin: 0
}

#finished-container{
  width: max-content;
  margin: 0 auto;
}

.final-score-row {
  width: max-content;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.final-score-row * {
  display: inline;
}
</style>