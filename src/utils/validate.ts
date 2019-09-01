import schema from 'async-validator';
import { isString, isArray } from 'lodash';

import { ValidateRules, ValidateError } from '@/types';

class ValidatorUtils {
  private data: AnyObject;
  private validators: AnyObject;

  constructor({ rules = {}, data = {}, cover = true }) {
    this.validators = {};
    this.data = data;
    this.setRules(rules, cover);
  }

  /**
   * 设置校验规则
   * @param rules async-validator 的校验规则
   * @param cover 是否替换旧规则
   */
  public setRules(rules: ValidateRules, cover: boolean) {
    if (cover) {
      this.validators = {};
    }

    Object.keys(rules).forEach((key) => {
      this.validators[key] = new schema({ [key]: rules[key] });
    });
  }

  public validate(
    dataKey?: string | string[]
  ): Promise<ValidateError[] | string | string[] | undefined> {
    // 错误数组
    const err: ValidateError[] = [];

    Object.keys(this.validators)
      .filter((key) => {
        // 若不传 dataKey 则校验全部。否则校验 dataKey 对应的数据（dataKey 可以对应一个（字符串）或多个（数组））
        return (
          !dataKey ||
          (dataKey &&
            ((isString(dataKey) && dataKey === key) ||
              (isArray(dataKey) && dataKey.includes(key))))
        );
      })
      .forEach((key) => {
        this.validators[key].validate(
          { [key]: this.data[key] },
          (error: ValidateError[]) => {
            if (error) {
              err.push(error[0]);
            }
          }
        );
      });

    if (err.length > 0) {
      return Promise.reject(err);
    } else {
      return Promise.resolve(dataKey);
    }
  }
}

export default ValidatorUtils;
