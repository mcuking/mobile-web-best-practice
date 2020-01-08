import http from '../http';
import m from '@/utils/m';

import { IQuote } from '@/types';

export interface ICommonService {
  getQuoteList(): Promise<IQuote[]>;
}

export class CommonService implements ICommonService {
  @m({ maxAge: 60 * 1000 })
  public async getQuoteList(): Promise<IQuote[]> {
    const {
      data: { list }
    } = await http({
      method: 'post',
      url: '/quote/getList',
      data: {}
    });

    return list;
  }
}
