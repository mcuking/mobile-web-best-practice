<template>
  <div class="page">
    <van-nav-bar title="选择日期"
                 left-text="返回"
                 left-arrow
                 @click-left="onClickLeft" />
    <Calendar @select="handleSelect"></Calendar>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Calendar from '@/components/calendar/index.vue';
import { NavBar } from 'vant';

Vue.use(NavBar);

@Component({
  components: {
    Calendar
  }
})
export default class DatePicker extends Vue {
  private onClickLeft() {
    this.$router.go(-1);
  }

  private handleSelect(...arg: DateObject[]) {
    this.$bus.emit('select-date', arg);
    this.$router.go(-1);
  }
}
</script>
<style lang="less" scoped></style>
