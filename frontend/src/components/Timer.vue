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
      {{timeLeftFormatted}}
      </span>
  </div>
</template>

<script>
export default {
  name: "timer.vue",
  data: function() {
    return {
      timeLeft: 0,
      maxTime: 0,
      interval: undefined,
      callback: () => {}
    }
  },
  computed: {
    timeLeftFormatted() {
      if(this.timeLeft < 0)
        return '--:--';
      let minutes = String(Math.floor(this.timeLeft / 60)).padStart(2, '0');
      let seconds = String(this.timeLeft % 60).padStart(2, '0');
      return minutes + ':' + seconds;
    }
  },
  methods: {
    start(seconds, callback = () => {}) {
      this.stop();
      this.timeLeft = seconds;
      this.maxTime = seconds;
      this.callback = callback;

      let handler = () => {
        this.timeLeft--;
        this.setCircleDasharray();

        if(this.timeLeft < 0) {
          this.callback();
          this.stop();
        }
      }

      setTimeout(() => {
        handler();
        this.interval = setInterval(handler, 1000);
      }, 1);
    },
    stop() {
      if(this.interval){
        clearInterval(this.interval);
        this.interval = undefined;
      }
    },
    setCircleDasharray() {
      if(this.timeLeft < 0)
        return 0;
      let a = (283 * (this.timeLeft / this.maxTime)).toFixed(0);
      this.$refs.pathRemaining.setAttribute('stroke-dasharray', a + ' 283');
    }
  }
}
</script>

<style scoped>
/* Sets the containers height and width */
.base-timer {
  position: relative;
  height: 200px;
  width: 200px;
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
  width: 200px;
  height: 200px;

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
  /*stroke-linecap: round;*/

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