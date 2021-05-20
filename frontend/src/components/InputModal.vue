<template>
  <popup-modal ref="popup" v-on:cancelByClickingOutside="_cancel">
    <h3 style="margin-top: 0">{{ title }}</h3>
    <p v-show="message">{{ message }}</p>

    <input v-for="(input, index) of inputs"
            v-bind:type="input.type"
            v-bind:placeholder="input.placeholder"
            v-bind:key="index"
            v-model="inputValues[index]">

    <div class="btn-container">

      <button v-show="okButton" class="ok-btn" @click.stop="_confirm">{{ okButton }}</button>
      <button v-show="redButton" class="red-btn" @click.stop="_confirm">{{ redButton }}</button>
      <button v-show="cancelButton" class="cancel-btn" @click.stop="_cancel">{{ cancelButton }}</button>
    </div>
  </popup-modal>
</template>

<script>
import PopupModal from "@/components/PopupModal";

export default {
  name: 'InputModal',

  components: { PopupModal },

  data: () => ({
    title: undefined,
    message: undefined,
    inputs: [],
    okButton: undefined,
    redButton: undefined,
    cancelButton: undefined,
    callback: undefined,
    inputValues: []
  }),

  methods: {
    show(opts = {}) {
      this.title = opts.title
      this.message = opts.message
      this.inputs = opts.inputs;
      this.okButton = opts.okButton
      this.redButton = opts.redButton;
      this.cancelButton = opts.cancelButton;
      this.callback = opts.callback;
      this.$refs.popup.open()
    },
    _confirm() {
      this.$refs.popup.close()

      if(this.callback)
        this.callback(this.inputValues);
    },
    _cancel() {
      this.$refs.popup.close();

      if(this.callback)
        this.callback(false);
    }
  },
}
</script>

<style scoped>
.btn-container {
  width: max-content;
  float: right;
}

input {
  display: block;
  margin: 10px 0;
}

button {
  color: white;
  /*text-decoration: underline;*/
  /*line-height: 2rem;*/
  cursor: pointer;
  /*float: right;*/
  margin-left: 10px;
}

.red-btn {
  background-color: red;
}

</style>