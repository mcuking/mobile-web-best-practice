declare const __VERSION__: string;

declare module 'vue-page-stack';

declare module 'async-validator';

type Platform = 'browser' | 'android' | 'ios';

interface Window {
  $sentry: AnyObject;
  $platform: Platform;
}

interface AnyObject {
  [propName: string]: any;
}

interface ListQuery extends AnyObject {
  page: number;
  count: number;
}
