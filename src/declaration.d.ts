declare var __VERSION__: string;

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

interface RequestErrorInfo {
  error: Error;
  type: string;
  requestUrl: string;
  requestOptions: string;
  response?: string;
}

interface ListQuery extends AnyObject {
  page: number;
  count: number;
}

interface DailyItem {
  dailyId?: string;
  today?: string | null;
  tomorrow?: string | null;
  goal?: string | null;
  userName?: string;
  create?: number;
  update?: number;

  [propName: string]: any;
}

declare module 'vue-page-stack';
