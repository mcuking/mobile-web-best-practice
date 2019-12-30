declare const __VERSION__: string;

declare module 'vue-page-stack';

declare module 'async-validator';

declare module 'vuedraggable';

type Platform = 'browser' | 'android' | 'ios';

type RouterMode = 'hash' | 'history' | 'abstract';

interface Window {
  $sentry: AnyObject;
  $appVersion: string | undefined;
  $systemVersion: string | undefined;
  $platform: Platform;
}

interface AnyObject {
  [propName: string]: any;
}

interface ListQuery extends AnyObject {
  page: number;
  count: number;
}

interface Dictionary<T> {
  [index: string]: T;
}
interface NumericDictionary<T> {
  [index: number]: T;
}
