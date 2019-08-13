import Vue from 'vue';

export default new Vue({
  methods: {
    on(event: string, callback: () => void) {
      this.$on(event, callback);
      return this;
    },

    once(event: string, callback: () => void) {
      this.$once(event, callback);
      return this;
    },

    off(event: string, callback: () => void) {
      this.$off(event, callback);
      return this;
    },

    emit(event: string, ...args: any[]) {
      this.$emit(event, ...args);
      return this;
    },
  },
});
