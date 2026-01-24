import { defineStore } from 'pinia'

export const useToastStore = defineStore('toast', {
  state: () => ({
    show: false,
    message: '',
    type: 'success', // success | error
    visible: false,
  }),

  actions: {
    success(msg) {
      this.message = msg
      this.type = 'success'
      this.showToast()
      this.visible = true;
    },

    error(msg) {
      this.message = msg
      this.type = 'error'
      this.showToast()
      this.visible = true;
    },

    showToast() {
      this.show = true
      setTimeout(() => {
        this.show = false
      }, 3000)
    },

    hide() {
      this.visible = false;
    }
  },
})
