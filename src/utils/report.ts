import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';

import { UserInfo, ReportOptions } from '@/types';

class Report {
  // 单例模式
  public static getInstance(Vue: AnyObject, options: ReportOptions) {
    if (!this.instance) {
      this.instance = new Report(Vue, options);
      this.instance.install();
      this.instance.registerGlobalError();
    }
    return this.instance;
  }

  private static instance: Report;

  public Vue: AnyObject;
  public options: ReportOptions;

  constructor(Vue: AnyObject, options: ReportOptions) {
    this.Vue = Vue;
    this.options = options;
  }

  // 初始化
  public install() {
    Sentry.init({
      dsn: this.options.dsn,
      integrations: [
        new Integrations.Vue({ Vue: this.Vue, attachProps: true })
      ],
      release: this.options.release,
      environment: this.options.environment
    });
  }

  // 设置用户信息
  public setUser(userInfo: UserInfo) {
    Sentry.setUser(userInfo);
  }

  /**
   * 注册全局错误处理
   */
  public registerGlobalError() {
    // 全局监控资源加载错误
    window.addEventListener(
      'error',
      (event) => {
        // 过滤 js error
        const target = event.target || event.srcElement;
        const isElementTarget =
          target instanceof HTMLScriptElement ||
          target instanceof HTMLLinkElement ||
          target instanceof HTMLImageElement;
        if (!isElementTarget) {
          return false;
        }
        // 上报资源地址
        const url =
          (target as HTMLScriptElement | HTMLImageElement).src ||
          (target as HTMLLinkElement).href;

        this.log({
          error: new Error(`ResourceLoadError: ${url}`),
          type: 'resource load'
        });
      },
      true
    );
  }
  /**
   * 主动上报
   */
  public log(info: AnyObject) {
    Sentry.withScope((scope) => {
      Object.keys(info).forEach((key) => {
        if (key !== 'error') {
          scope.setExtra(key, info[key]);
        }
      });
      Sentry.captureException(info.error || new Error(''));
    });
  }
}

export default Report;
