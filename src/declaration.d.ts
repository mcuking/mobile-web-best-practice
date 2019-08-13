interface AnyObject {
  [propName: string]: any;
}

interface DateObject {
  year: string;
  month: string;
  day: string;
}

interface Window {
  $sentry: AnyObject;
}

interface ReportOptions {
  dsn: string;
  release: string;
  environment: string;
}

interface UserInfo {
  username: string;
  userid?: string;
}

declare module 'vue-page-stack';
