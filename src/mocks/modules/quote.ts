import Mock, { Random } from 'mockjs';
import MockAdapter from 'axios-mock-adapter';
import { sleep } from '@/utils/common-tools';

const QUOTE_TPL = {
  id: () => Random.integer(0),
  content: () => Random.cparagraph(2, 6),
  createTime: () => Random.datetime(),
  creator: () => Random.name()
};

export default function init(mock: MockAdapter) {
  mock.onPost('/quote/getList').reply(async () => {
    await sleep(2 * 1000);
    const total = 300;
    return [
      200,
      Mock.mock({
        data: {
          [`list|${total}`]: [QUOTE_TPL]
        },
        errmsg: '',
        errno: 0
      })
    ];
  });
}
