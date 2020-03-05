import http from '../http';

import { IQuote } from '@/types';

export interface ICommonService {
  getQuoteList(): Promise<IQuote[]>;
}

export class CommonService implements ICommonService {
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
