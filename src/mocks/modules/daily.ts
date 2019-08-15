import Mock, { Random } from 'mockjs';
import MockAdapter from 'axios-mock-adapter';
import { sleep } from '@/utils/tools';

const DAILY_TPL = {
  dailyId: () => Random.integer(0),
  principalId: () => Random.cname(),
  today: () => Random.cparagraph(2, 6),
  tomorrow: () => Random.cparagraph(2, 6),
  goal: () => Random.cparagraph(2, 6),
  'comments|2-4': [
    {
      commentator: () => Random.cname(),
      value: () => Random.cparagraph(2, 6),
      rate: () => Random.integer(1, 5),
      createTime: () => Random.datetime()
    }
  ],
  rate: () => Random.integer(1, 5),
  updateTime: () => Random.datetime(),
  createTime: () => Random.datetime(),
  creator: () => Random.datetime()
};

export default function init(mock: MockAdapter) {
  mock.onPost('/daily/getList').reply(async ({ data }) => {
    await sleep(2 * 1000);
    data = JSON.parse(data);
    const total = 10;
    return [
      200,
      Mock.mock({
        data: {
          total,
          [`list|${Math.min(data.count, total)}`]: [DAILY_TPL]
        },
        errmsg: '',
        errno: 0
      })
    ];
  });
}
