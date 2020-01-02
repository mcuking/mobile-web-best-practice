<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator';
import { Route } from 'vue-router';

@Component
export default class App extends Vue {
  private handleFocusOut() {
    // input 焦点失焦后，ios 键盘收起，但没有触发 window resize，导致实际页面dom仍然被键盘顶上去--错位
    document.addEventListener('focusout', () => {
      document.body.scrollTop = 0;
    });
  }

  // 监听resize事件（键盘弹起触发），然后将 input textarea 元素滑动到可视区域，并将特定元素隐藏
  private handleResize() {
    const clientHeight = document.documentElement.clientHeight;

    const resizeHandler = () => {
      // 判断当前 active 的元素是否为 input 或 textarea
      if (
        document.activeElement!.tagName === 'INPUT' ||
        document.activeElement!.tagName === 'TEXTAREA'
      ) {
        setTimeout(() => {
          // 原生方法，滚动至需要显示的位置
          document.activeElement!.scrollIntoView();
        }, 0);
      }

      // 解决键盘弹起后 fixed 定位元素被顶起问题
      const bodyHeight = document.documentElement.clientHeight;
      const ele = document.getElementById('fixed-bottom');
      if (ele) {
        if (clientHeight > bodyHeight) {
          (ele as HTMLElement).style.display = 'none';
        } else {
          (ele as HTMLElement).style.display = 'block';
        }
      }
    };

    window.addEventListener('resize', resizeHandler);
  }

  private created() {
    this.handleFocusOut();
    this.handleResize();
  }
}
</script>

<style lang="less">
@import './less/base.less';

#app {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
