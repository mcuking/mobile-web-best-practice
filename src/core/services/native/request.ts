import Vue from 'vue';
import dsbridge from 'dsbridge';
import compareVersions from 'compare-versions';
import NATIVE_ERROR_CODE_MAP from '@/constants/native-error-code';

import { NativeApiErrorInfo, SyncCalendarParams } from '@/types';

export interface INativeService {
  syncCalendar(params: SyncCalendarParams, onSuccess: () => void): void;
}

export class NativeService implements INativeService {
  // 同步到日历
  @limit(['android', 'ios'], '1.0.1')
  public syncCalendar(params: SyncCalendarParams, onSuccess: () => void): void {
    const cb = async (errCode: number) => {
      const msg = NATIVE_ERROR_CODE_MAP[errCode];

      Vue.prototype.$toast(msg);

      if (errCode !== 6000) {
        this.errorReport(msg, 'syncCalendar', params);
      } else {
        await onSuccess();
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
 * 限制接口调用的平台和客户端版本
 * 实际情况中多个平台客户端版本不一致，可以根据项目需求对下面的函数做修改
 * @param {string} [platforms=['android', 'ios']]
 * @param {string} [version='1.0.0']
 * @returns
 */
function limit(platforms = ['android', 'ios'], version = '1.0.0') {
  return (target: AnyObject, name: string, descriptor: PropertyDescriptor) => {
    if (!platforms.includes(window.$platform)) {
      descriptor.value = () => {
        return Vue.prototype.$toast(
          `当前处在 ${window.$platform} 环境，无法调用接口哦`
        );
      };

      return descriptor;
    }

    if (
      window.$appVersion &&
      compareVersions.compare(version, window.$appVersion, '>')
    ) {
      descriptor.value = () => {
        return Vue.prototype.$toast(
          `当前客户端版本过低，请升级到 ${version} 以上版本`
        );
      };

      return descriptor;
    }
  };
}
