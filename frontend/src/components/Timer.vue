<template>
  <div class="base-timer">
    <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <g class="base-timer__circle">
        <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"/>
      </g>
      <path
          ref="pathRemaining"
          id="base-timer-path-remaining"
          stroke-dasharray="283"
          class="base-timer__path-remaining"
          d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </svg>
    <span id="base-timer-label">
      0:{{ timeLeft }}
      </span>
  </div>
</template>

<script>
export default {
  name: "timer.vue",
  data: function() {
    return {
      timeLeft: 0,
      maxTime: 0
    }
  },
  methods: {
    start(seconds) {
      this.timeLeft = seconds;
      this.maxTime = seconds;
      let interval = setInterval(() => {
        this.timeLeft--;
        this.setCircleDasharray();

        if(this.timeLeft === 0) {
          clearInterval(interval);
        }
      }, 1000);
    },
    setCircleDasharray() {
      let a = (283 * (this.timeLeft / this.maxTime)).toFixed(0);
      console.log(a);
      this.$refs.pathRemaining.setAttribute('stroke-dasharray', a + ' 283');
    }
  }
}
</script>

<style scoped>
/* Sets the containers height and width */
.base-timer {
  position: relative;
  height: 250px;
  width: 250px;
}

/* Removes SVG styling that would hide the time label */
.base-timer__circle {
  fill: none;
  stroke: none;
}

/* The SVG path that displays the timer's progress */
.base-timer__path-elapsed {
  stroke-width: 7px;
  stroke: grey;
}

#base-timer-label {
  position: absolute;

  /* Size should match the parent container */
  width: 250px;
  height: 250px;

  /* Keep the label aligned to the top */
  top: 0;

  /* Create a flexible box that centers content vertically and horizontally */
  display: flex;
  align-items: center;
  justify-content: center;

  /* Sort of an arbitrary number; adjust to your liking */
  font-size: 48px;
}

.base-timer__path-remaining {
  /* Just as thick as the original ring */
  stroke-width: 7px;

  /* Rounds the line endings to create a seamless circle */
  stroke-linecap: round;

  /* Makes sure the animation starts at the top of the circle */
  transform: rotate(90deg);
  transform-origin: center;

  /* One second aligns with the speed of the countdown timer */
  transition: 1s linear all;

  /* Allows the ring to change color when the color value updates */
  stroke: #F29544;
  fill: none;
}

.base-timer__svg {
  /* Flips the svg and makes the animation to move left-to-right */
  transform: scaleX(-1);
}
</style>