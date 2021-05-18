<template>
  <popup-modal ref="popup">
    <h3 style="margin-top: 0">{{ title }}</h3>
    <p>{{ message }}</p>
    <div class="btn">
      <button class="ok-btn" @click="_confirm">{{ okButton }}</button>
    </div>
  </popup-modal>
</template>

<script>
import PopupModal from "@/components/PopupModal";

export default {
  name: 'ConfirmModal',

  components: { PopupModal },

  data: () => ({
    title: undefined,
    message: undefined,
    okButton: undefined,
    resolvePromise: undefined,
    rejectPromise: undefined,
  }),

  methods: {
    show(opts = {}) {
      this.title = opts.title
      this.message = opts.message
      this.okButton = opts.okButton
      this.$refs.popup.open()

      return new Promise((resolve, reject) => {
        this.resolvePromise = resolve
        this.rejectPromise = reject
      })
    },

    _confirm() {
      this.$refs.popup.close()
      this.resolvePromise(true)
    },
  },
}
</script>

<style scoped>
.btn {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.ok-btn {
  color: white;
  text-decoration: underline;
  line-height: 2.5rem;
  cursor: pointer;
}

</style>