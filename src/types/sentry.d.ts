type Environment = 'Prod' | 'Stage';

export interface ReportOptions {
  dsn: string;
  release: string;
  environment: Environment;
}

export interface ServerApiErrorInfo {
  error: Error;
  type: 'request';
  requestUrl: string;
  requestOptions: string;
  response?: string;
}

export interface NativeApiErrorInfo {
  error: Error;
  type: 'callNative';
  methodName: string;
  params?: any;
}
