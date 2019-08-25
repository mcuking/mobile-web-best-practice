import Vue from 'vue';
import dsbridge from 'dsbridge';
import NATIVE_ERROR_CODE_MAP from './native-error-code';

import { NativeApiErrorInfo, SyncCalendarParams } from '@/types';

class NativeMethods {
  // 同步到日历
  @p()
  public syncCalendar(params: SyncCalendarParams) {
    const cb = (errCode: number) => {
      const msg = NATIVE_ERROR_CODE_MAP[errCode];

      Vue.prototype.$toast(msg);

      if (errCode !== 6000) {
        this.errorReport(msg, 'syncCalendar', params);
      }
    };
    dsbridge.call('syncCalendar', params, cb);
  }

  // 调用 native 接口出错向 sentry 发送错误信息
  private errorReport(errorMsg: string, methodName: string, params: any) {
    if (window.$sentry) {
      const errorInfo: NativeApiErrorInfo = {
        error: new Error(errorMsg),
        type: 'callNative',
        methodName,
        params: JSON.stringify(params)
      };
      window.$sentry.log(errorInfo);
    }
  }
}

/**
 * @param {platforms} - 接口限制的平台
 * @return {Function} - 装饰器
 */
function p(platforms = ['android', 'ios']) {
  return (target: AnyObject, name: string, descriptor: PropertyDescriptor) => {
    if (!platforms.includes(window.$platform)) {
      descriptor.value = () => {
        return Vue.prototype.$toast(
          `当前处在 ${window.$platform} 环境，无法调用接口哦`
        );
      };
    }

    return descriptor;
  };
}

export default new NativeMethods();
