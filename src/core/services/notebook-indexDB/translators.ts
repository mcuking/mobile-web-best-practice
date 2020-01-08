import { INotebook } from '@/types';

/**
 * 用于清洗服务端或客户端接口返回数据：删除部分数据、修改属性名、转化部分数据等
 *
 * @export
 * @param {INote} item
 * @returns
 */
export function noteTranslator(item: INotebook) {
  item.themeColor = item.color;
  return item;
}
