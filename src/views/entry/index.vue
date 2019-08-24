<template>
  <div class="layout__page">
    <div class="layout__header">
      <van-nav-bar title="华山论键" />
    </div>
    <div class="layout__body">
      <div>
        <h2 class="entry__title--primary">{{meetingInfo.title}}</h2>
        <div class="entry__logo"></div>
        <div class="entry__sub-section">
          <div class="entry__title--sub">大会地点</div>
          <div>{{meetingInfo.location}}</div>
        </div>
        <div class="entry__sub-section">
          <div class="entry__title--sub">大会时间</div>
          <div class="entry__time">{{startTimeStr}} 开始</div>
          <div class="entry__time">{{endTimeStr}} 结束</div>
        </div>
      </div>
      <div>
        <van-button type="primary"
                    class="entry__button--apply"
                    size="large"
                    @click="gotoSignUp">
          报名参加
        </van-button>
        <van-button type="default"
                    size="large"
                    @click="syncCalendar">
          同步日程到日历
        </van-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { NavBar, Button } from 'vant';
import moment from 'moment';
import nativeMethods from '@/utils/native-methods';

Vue.use(NavBar).use(Button);

@Component
export default class Entry extends Vue {
  private meetingInfo = {
    id: '0d93cfe7-07f2-4453-a528-fd085fd15460',
    title: '华山论键大会',
    location: '光明顶',
    startTime: moment()
      .add(10, 'day')
      .valueOf(),
    endTime: moment()
      .add(10, 'day')
      .add(2, 'hour')
      .valueOf(),
    alarm: [5]
  };

  private startTimeStr = moment()
    .add(10, 'day')
    .format('YYYY年MM月DD日 HH时mm分');

  private endTimeStr = moment()
    .add(10, 'day')
    .add(2, 'hour')
    .format('YYYY年MM月DD日 HH时mm分');

  private gotoSignUp() {
    this.$router.push({ name: 'form' });
  }

  private syncCalendar() {
    if (window.$platform === 'browser') {
      this.$toast('当前处在浏览器环境，无法调用 native 接口哦～');
      return;
    }
    nativeMethods.syncCalendar(this.meetingInfo);
  }
}
</script>
<style lang="less" scoped>
@import '~@/less/mixins/bg-image.less';

.layout__body {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 16px;
}
.entry__title--primary {
  text-align: center;
  font-size: 20px;
  font-weight: 700;
}
.entry__logo {
  width: 80px;
  height: 80px;
  margin: 40px auto 40px auto;
  .bg-image('./img/logo');
  background-size: contain;
  background-repeat: no-repeat;
}
.entry__sub-section {
  margin-bottom: 40px;
  text-align: center;
}
.entry__title--sub {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
}
.entry__time {
  margin-bottom: 10px;
}
.entry__button--apply {
  margin-bottom: 20px;
}
</style>
