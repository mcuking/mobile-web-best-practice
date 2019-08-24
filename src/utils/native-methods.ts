import Vue from 'vue';
import dsbridge from 'dsbridge';
import NATIVE_ERROR_CODE_MAP from './native-error-code';

import { NativeApiErrorInfo, SyncCalendarParams } from '@/types';

class NativeMethods {
  // 同步到日历
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

export default new NativeMethods();
