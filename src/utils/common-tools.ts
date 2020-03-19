import { isFunction } from 'lodash';
import moment from 'moment';

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
    window.$appVersion = '1.0.0';
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

/**
 * 将字典转成对象数据
 *
 * @export
 * @param {Dictionary<any>} dict
 * @param {string} [keyLabel='value']
 * @param {string} [valueLabel='text']
 * @returns
 */
export function transDictToArray(
  dict: Dictionary<any>,
  keyLabel = 'value',
  valueLabel = 'text'
) {
  const arr = [];
  for (const key in dict) {
    if (dict.hasOwnProperty(key)) {
      arr.push({
        [keyLabel]: key,
        [valueLabel]: dict[key]
      });
    }
  }
  return arr;
}

/**
 * vant-time-picker 组件格式化函数
 *
 * @export
 * @param {string} type
 * @param {string} value
 * @returns {string}
 */
export function dateTimePickerFormatter(type: string, value: string): string {
  const map: AnyObject = {
    year: '年',
    month: '月',
    day: '日',
    hour: '时',
    minute: '分',
    second: '秒'
  };
  return `${value}${map[type]}`;
}

/**
 * 时间格式化
 *
 * @export
 * @param {(Date | string | null | undefined)} time
 * @returns
 */
export function formatTime(time: Date | string | null | undefined) {
  if (!time) {
    return '';
  }
  if (moment(time).format('YYYYMD') === moment().format('YYYYMD')) {
    return moment(time).format('HH:mm');
  } else if (
    moment(time).format('YYYYMD') ===
    moment()
      .subtract(1)
      .format('YYYYMD')
  ) {
    return '昨天';
  } else if (moment(time).format('YYYY') === moment().format('YYYY')) {
    return moment(time).format('M月D日');
  }
  return moment(time).format('YYYY年M月D日');
}

/**
 * 生成随机数
 *
 * @export
 * @param {number} n  随机数位数
 * @returns
 */
export function createRandomNum(n: number) {
  let rnd = '';
  for (let i = 0; i < n; i++) {
    rnd += Math.floor(Math.random() * 10);
  }
  return parseInt(rnd, 10);
}
