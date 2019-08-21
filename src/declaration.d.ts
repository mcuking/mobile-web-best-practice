declare const __VERSION__: string;

declare module 'vue-page-stack';

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
  $platform: string;
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

interface ServerApiErrorInfo {
  error: Error;
  type: string;
  requestUrl: string;
  requestOptions: string;
  response?: string;
}

interface NativeApiErrorInfo {
  error: Error;
  type: string;
  methodName: string;
  params: any;
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

interface SyncCalendarParams {
  id: string;
  title: string;
  location: string;
  startTime: number;
  endTime: number;
  alarm: number[];
}
