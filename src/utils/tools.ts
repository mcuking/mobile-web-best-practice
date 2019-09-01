import { isFunction } from 'lodash';
import { Context } from 'mocha';

/**
 * 用于占用进程
 *
 * @export
 * @param {*} duration 占用时长，单位 ms
 * @returns
 */
export const sleep = (duration: number) =>
  new Promise((resolve) => void setTimeout(resolve, duration));

// 从 UA 获取设备相关信息并在全局初始化
export const initPlatform = () => {
  const UA = navigator.userAgent;
  const info = UA.match(/\s{1}DSBRIDGE[\w\.]+$/g);
  if (info && info.length > 0) {
    const infoArray = info[0].split('_');
    window.$appVersion = infoArray[1];
    window.$systemVersion = infoArray[2];
    window.$platform = infoArray[3] as Platform;
  } else {
    window.$appVersion = undefined;
    window.$systemVersion = undefined;
    window.$platform = 'browser';
  }
};

interface ImportAllOptions {
  useDefault?: boolean;
  keyTransformFunc?: (key: string) => string;
  filterFunc?: (key: string) => boolean;
}

/**
 * 导入一个模块上下文
 *
 * @export
 * @param {*} context 模块上下文，require.context 的返回值
 * @param {object} [options: ImportAllOptions]
 * @returns
 */
export const importAll = (
  context: __WebpackModuleApi.RequireContext,
  options: ImportAllOptions = {}
): AnyObject => {
  const { useDefault = true, keyTransformFunc, filterFunc } = options;

  let keys = context.keys();

  if (isFunction(filterFunc)) {
    keys = keys.filter(filterFunc);
  }

  return keys.reduce((acc: AnyObject, curr: string) => {
    const key = isFunction(keyTransformFunc) ? keyTransformFunc(curr) : curr;
    acc[key] = useDefault ? context(curr).default : context(curr);
    return acc;
  }, {});
};
