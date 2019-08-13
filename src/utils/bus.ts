import Vue from 'vue';

export default new Vue({
  methods: {
    on(event: string, callback: Function) {
      this.$on(event, callback);
      return this;
    },

    once(event: string, callback: Function) {
      this.$once(event, callback);
      return this;
    },

    off(event: string, callback: Function) {
      this.$off(event, callback);
      return this;
    },

    emit(event: string, ...args: any[]) {
      this.$emit(event, ...args);
      return this;
    }
  }
});
