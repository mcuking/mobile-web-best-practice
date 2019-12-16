import Vue from 'vue';

export default new Vue({
  methods: {
    on(event: string, callback: (...args: any[]) => void) {
      this.$on(event, callback);
      return this;
    },

    once(event: string, callback: (...args: any[]) => void) {
      this.$once(event, callback);
      return this;
    },

    off(event: string, callback: (...args: any[]) => void) {
      this.$off(event, callback);
      return this;
    },

    emit(event: string, ...args: any[]) {
      this.$emit(event, ...args);
      return this;
    }
  }
});
