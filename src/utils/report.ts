import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';

class Report {
  private static instance: Report;

  Vue: AnyObject;
  options: ReportOptions;

  constructor(Vue: AnyObject, options: ReportOptions) {
    this.Vue = Vue;
    this.options = options;
  }

  /**
   * 单例模式
   */
  static getInstance(Vue: AnyObject, options: ReportOptions) {
    if (!this.instance) {
      this.instance = new Report(Vue, options);
      this.instance.install();
      this.instance.registerGlobalError();
    }
    return this.instance;
  }

  /**
   * 初始化
   */
  install() {
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
  setUser(userInfo: UserInfo) {
    Sentry.setUser(userInfo);
  }

  /**
   * 注册全局错误处理
   */
  registerGlobalError() {
    // 全局监控资源加载错误
    window.addEventListener(
      'error',
      event => {
        // 过滤js error
        let target = event.target || event.srcElement;
        let isElementTarget =
          target instanceof HTMLScriptElement ||
          target instanceof HTMLLinkElement ||
          target instanceof HTMLImageElement;
        if (!isElementTarget) return false;
        // 上报资源地址
        let url = (target as any).src || (target as any).href;

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
  log(info: AnyObject) {
    Sentry.withScope(scope => {
      Object.keys(info).forEach(key => {
        if (key !== 'error') {
          scope.setExtra(key, info[key]);
        }
      });
      Sentry.captureException(info.error || new Error(''));
    });
  }
}

export default Report;
