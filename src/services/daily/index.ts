import http from '../http';
import m from '@/utils/m';

class Home {
  @m({ maxAge: 60 * 1000 })
  public async getUnderlingDailyList(
    query: ListQuery
  ): Promise<{ total: number; list: DailyItem[] }> {
    const {
      data: { total, list }
    } = await http({
      method: 'post',
      url: '/daily/getList',
      data: query
    });

    return { total, list };
  }
}

export default new Home();
