<template>
<div>
  <h1> WELCOME TEACHERS :) </h1>

  <h2> Your students: </h2>

    <p v-for="(student, index) in students" v-bind:key="index">
      {{ student.name }}
    </p>

</div>
</template>

<script>
export default {
  name: "Home-teacher.vue",
  data: function() {
    return {
      students: [{name: 'Bob'}, {name: 'Bob2'}, {name: 'Bob3'}, {name: 'Bob4'}, {name: 'Bob5'}]
    }
  }
}
</script>

<style scoped>
h1, h2, h3, p{
  text-align: center;
}
</style>