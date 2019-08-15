<template>
  <div class="layout__page">
    <div class="layout__header">
      <van-nav-bar title="华山论键" />
    </div>
    <div class="layout__body">
      <h2 class="entry__title--primary">华山论键雄</h2>
      <van-button type="primary"
                  size="large"
                  @click="gotoSignUp">
        报名参加
      </van-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { NavBar, Button } from 'vant';

Vue.use(NavBar).use(Button);

@Component
export default class Entry extends Vue {
  private gotoSignUp() {
    this.$router.push({ name: 'form' });
  }
}
</script>
<style lang="less" scoped>
.layout__body {
  padding: 16px;
}
.entry__title--primary {
  text-align: center;
  height: 240px;
  line-height: 240px;
  font-size: 20px;
  font-weight: 700;
}
</style>
