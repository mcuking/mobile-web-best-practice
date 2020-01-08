import { CommonService, ICommonService } from '../services/common/request';

class CommonInteractor {
  constructor(private commonService: ICommonService) {}
  public async getQuoteList() {
    try {
      const list = await this.commonService.getQuoteList();
      return list;
    } catch (error) {
      throw error;
    }
  }
}

const commonInteractor = new CommonInteractor(new CommonService());
export default commonInteractor;
