<template>
  <div class="layout__page">
    <div class="layout__header">
      <van-nav-bar title="名言警句三百篇"
                   left-arrow
                   @click-left="handleClickLeft" />
    </div>
    <div class="layout__body"
         v-touch:swipe="handleSwipeRight">
      <van-cell-group class="info__list">
        <van-cell v-for="item in list"
                  :key="item.id"
                  :title="`${item.content}  --${item.creator}`" />
      </van-cell-group>
      <div v-if="isLoading"
           class="info__loading-wrapper">
        <van-loading type="spinner"
                     color="#1989fa" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins } from 'vue-property-decorator';
import SwipeRightMixin from '@/utils/swipe-right-mixin';
import { commonInteractor } from '@/core';
import LocalConfig from '@/config.json';
import { IQuote } from '@/types';

import { NavBar, List, Cell, CellGroup, Loading } from 'vant';

Vue.use(NavBar)
  .use(List)
  .use(Cell)
  .use(CellGroup)
  .use(Loading);

@Component
export default class Quote extends Mixins(SwipeRightMixin) {
  private list: IQuote[] = [];

  private isLoading = false;

  private handleClickLeft() {
    this.$router.go(-1);
  }

  private async getQuoteList() {
    try {
      this.isLoading = true;
      this.list = await commonInteractor.getQuoteList();
    } catch (error) {
      console.log(error);
    } finally {
      this.isLoading = false;
    }
  }

  private async created() {
    this.getQuoteList();
  }
}
</script>

<style lang="less" scoped>
.info__list {
  margin-top: 20px;
}

.info__loading-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
