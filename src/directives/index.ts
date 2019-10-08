import Vue from 'vue';
import { importAll } from '@/utils/common-tools';

const directvieContext = require.context('./', false, /\.ts$/);
const directives = importAll(directvieContext, {
  filterFunc: (key: string) => key !== './index.ts',
  keyTransformFunc: (key: string) =>
    key.replace(/^\.\//, '').replace(/\.ts$/, '')
});

export default {
  install(vue: typeof Vue): void {
    Object.keys(directives).forEach((key) =>
      vue.directive(key, directives[key])
    );
  }
};
