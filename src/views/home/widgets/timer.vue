<template>
  <div class="home__timer">
    <div class="home__left-timer">
      <div class="home__left-timer--left">{{ moment().format('DD') }}</div>
      <div class="home__left-timer--right">
        <div>{{ moment().format('MMMM') }}</div>
        <div>{{ moment().format('YYYY') }}</div>
      </div>
    </div>
    <div class="home__right-timer">
      {{ moment().format('HH:mm') }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import moment from 'moment';

@Component({})
export default class Timer extends Vue {
  private moment = moment;
}
</script>

<style lang="less" scoped>
@import '~@/less/var.less';

.home__timer {
  display: flex;
  justify-content: space-between;
}

.home__left-timer {
  display: flex;
}

.home__left-timer--left {
  font-size: 40px;
  margin-right: 4px;
}

.home__left-timer--right {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  color: @gray-dark;
}

.home__right-timer {
  font-size: 40px;
}
</style>
