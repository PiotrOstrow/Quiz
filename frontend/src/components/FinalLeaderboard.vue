<template>
  <div id="finished-container">
    <h1>Quiz finished</h1>


    <div class="final-score-row" v-if="leaderboard.length > 0">
      <img id="gold-medal"   src="https://img.icons8.com/emoji/48/000000/1st-place-medal-emoji.png">
      <h1>{{ leaderboard[0].name }} - {{ leaderboard[0].score }} Points</h1>
    </div>
    <div class="final-score-row" v-if="leaderboard.length > 1">
      <img id="silver-medal" src="https://img.icons8.com/emoji/48/000000/2nd-place-medal-emoji.png">
      <h1>{{ leaderboard[1].name }} - {{ leaderboard[1].score }} Points</h1>
    </div>
    <div class="final-score-row" v-if="leaderboard.length > 2">
      <img id="bronze-medal" src="https://img.icons8.com/emoji/48/000000/3rd-place-medal-emoji.png">
      <h1>{{ leaderboard[2].name }} - {{ leaderboard[2].score }} Points</h1>
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

#finished-container{
  width: max-content;
  margin: 0 auto;
}

.final-score-row {
  width: max-content;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.final-score-row * {
  display: inline;
}
</style>