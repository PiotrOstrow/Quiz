<template>
  <div class="custom-select" :tabindex="tabindex" @blur="open = false">
    <div class="selected" :class="{ open: open }" @click="open = !open">
      {{ this.selectedComputed }}
    </div>
    <div class="items" :class="{ selectHide: !open }">
      <div
          v-for="(option, i) of options"
          :key="i"
          @click="
          selected = option;
          open = false;
          $emit('input', option);
        "
      >
        {{ option }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "StyledSelect",
  props: ['options', 'default'],
  data() {
    return {
      selected: this.default
          ? this.default
          : this.options.length > 0
              ? this.options[0]
              : null,
      open: false,
      tabindex: 0
    };
  },
  computed: {
    selectedComputed() {
      return this.selected ? this.selected : this.default;
    }
  },
  mounted() {
    this.$emit("input", this.selected);
  },
  methods: {
    select(value) {
      this.selected = value;
    }
  }
}
</script>

<style scoped>
.custom-select {
  position: relative;

  text-align: left;
  outline: none;
  /*height: 19px;*/
  height: max-content;
  /*height: 47px;*/
  /*line-height: 47px;*/
  font-size: 15px;
}

.custom-select .selected {
  background-color: rgba(0, 162, 232, 0.8);
  border-radius: 2px;
  border: none;
  color: #fff;
  cursor: pointer;
  user-select: none;
  padding: 8px;
  width: 100%;
  text-align:center;
}

.custom-select .selected.open {
  /*border: 1px solid #ad8225;*/
}

.custom-select .selected:after {
  /*position: absolute;*/

  content: '';
  float: right;
  /*top: 16px;*/
  /*right: .6em;*/
  /*width: 0;*/
  /*height: 0;*/
  height: 0;
  margin-top: 8px;

  border: 5px solid ;
  border-color: #fff transparent transparent transparent;
}

.custom-select .items {
  color: #fff;
  border-radius: 0px 0px 2px 2px;
  overflow: hidden;
  /*border-right: 1px solid #ad8225;*/
  /*border-left: 1px solid #ad8225;*/
  /*border-bottom: 1px solid #ad8225;*/
  position: absolute;
  background-color: rgba(0, 169, 242, 1);
  left: 0;
  right: 0;
  z-index: 1;
  width: 100%;
}

.custom-select .items div {
  color: #fff;
  cursor: pointer;
  user-select: none;
  padding: 8px;
  text-align: center;

}

.custom-select .items div:hover {
  background-color: rgba(0, 162, 232, 1);
}

.selectHide {
  display: none;
}

</style>