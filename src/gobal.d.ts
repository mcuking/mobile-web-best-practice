import Vue from 'vue';

declare module 'vue/types/vue' {
  interface Vue {
    $bus: Bus;
  }
}

interface Bus {
  on(): void;
  once(): void;
  off(): void;
  emit(): void;
}
