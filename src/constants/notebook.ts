import { transDictToArray } from '@/utils/common-tools';

export const THEME_COLOR_MAP: Dictionary<string> = {
  green: '绿色',
  blue: '蓝色',
  yellow: '黄色',
  red: '红色'
};

export const THEME_COLOR_ARRAY = transDictToArray(THEME_COLOR_MAP);
