import { INotebook } from '@/types';

/**
 * 用于清洗从服务端或客户端接口返回的数据：删除部分数据、修改属性名、转化部分数据等，一般可定义成纯函数形式
 * 由于该项目的所有接口返回都是由笔者定义的，所以并没有需要清洗的数据
 * @export
 * @param {INote} item
 * @returns
 */
export function noteTranslator(item: INotebook) {
  // item.themeColor = item.color;
  return item;
}
