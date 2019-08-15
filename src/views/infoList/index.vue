<template>
  <div class="layout__page">
    <div class="layout__header">
      <van-nav-bar title="论键十日诫"
                   left-text="返回"
                   left-arrow
                   @click-left="onClickLeft" />
    </div>
    <div class="layout__body">
      <van-list v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad">
        <van-cell v-for="item in list"
                  :key="item.dailyId"
                  :title="item.goal" />
      </van-list>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { NavBar, List, Cell } from 'vant';
import daily from '@/services/daily';

Vue.use(NavBar)
  .use(List)
  .use(Cell);

@Component
export default class InfoList extends Vue {
  private list: DailyItem[] = [];

  private loading = false;

  private finished = false;

  private onClickLeft() {
    this.$router.go(-1);
  }

  private async onLoad() {
    try {
      const { total, list } = await daily.getUnderlingDailyList({
        page: 1,
        count: 10
      });
      this.list = list;

      // 加载状态结束
      this.loading = false;

      // 数据全部加载完成
      if (this.list.length >= 10) {
        this.finished = true;
      }
    } catch (error) {
      throw error;
    }
  }
}
</script>
<style lang="less" scoped></style>
