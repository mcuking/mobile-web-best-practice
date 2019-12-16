import Vue from 'vue';

declare module 'vue/types/vue' {
  interface Vue {
    $bus: Bus;
  }
}

interface Bus {
  on(event: string, callback: (...args: any[]) => void): void;
  once(event: string, callback: (...args: any[]) => void): void;
  off(event: string, callback: (...args: any[]) => void): void;
  emit(event: string, ...args: any[]): void;
}
