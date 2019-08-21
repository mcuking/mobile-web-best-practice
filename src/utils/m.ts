import mem from 'mem';

/**
 * @param {MemOption} - mem 配置项
 * @return {Function} - 装饰器
 * @use 用于缓存部分接口请求函数或其他函数
 */
export default function m(options: AnyObject) {
  return (target: AnyObject, name: string, descriptor: PropertyDescriptor) => {
    const oldValue = descriptor.value;
    descriptor.value = mem(oldValue, options);
    return descriptor;
  };
}
