<template>
  <div id="hamburger-container" v-on:click="onClick" ref="burgerContainerRef">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
</template>

<script>
export default {
  name: "HamburgerMenu",
  data: function() {
    return {
      clicked: false
    }
  },
  methods: {
    onClick() {
      this.clicked = !this.clicked;
      if(this.clicked)
        this.$refs.burgerContainerRef.classList.add('clicked');
      else
        this.$refs.burgerContainerRef.classList.remove('clicked');

      this.$emit('hamburgerClick', this.clicked);
    }
  }
}
</script>

<style scoped>
#hamburger-container {
  width: max-content;
  height: max-content;
  position: absolute;
  right: 0;
  padding: 10px;
  /*margin: 8px;*/
  cursor: pointer;

}

#hamburger-container div {
  width: 27px;
  height: 4px;
  background-color: white;
  margin: 4px auto;

  transition: 1s transform, 1s opacity;
}

#hamburger-container div:nth-child(3) {
  position: absolute;
  top: 18px;
}

.clicked div:nth-child(2) {
  transform: rotateZ(45deg);
}

.clicked div:nth-child(3) {
  transform: rotateZ(-45deg);
}

.clicked div:nth-child(1), .clicked div:nth-child(4) {
  opacity: 0;
}

</style>