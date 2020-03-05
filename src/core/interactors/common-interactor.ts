import { CommonService, ICommonService } from '../services/common/request';

class CommonInteractor {
  public static getInstance() {
    return this._instance;
  }

  private static _instance = new CommonInteractor(new CommonService());

  private _quotes: any;

  constructor(private _service: ICommonService) {}

  public async getQuoteList() {
    // 单例模式下，将一些基本固定不变的接口数据保存在内存中，避免重复调用
    // 但要注意避免内存泄漏
    if (this._quotes !== undefined) {
      return this._quotes;
    }

    let response;

    try {
      response = await this._service.getQuoteList();
    } catch (error) {
      throw error;
    }

    this._quotes = response;
    return this._quotes;
  }
}

export default CommonInteractor.getInstance();
