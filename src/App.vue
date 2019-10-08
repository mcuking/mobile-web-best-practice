<template>
  <div id="app">
    <transition :name="transitionName">
      <vue-page-stack>
        <router-view class="router-view-c" />
      </vue-page-stack>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator';
import { Route } from 'vue-router';

@Component
export default class App extends Vue {
  private transitionName = 'forward';

  @Watch('$route')
  private onChildChanged(to: Route, from: Route) {
    if (to.params['stack-key-dir'] === 'forward') {
      this.transitionName = 'forward';
    } else {
      this.transitionName = 'back';
    }
  }

  private handleFocusOut() {
    // input 焦点失焦后，ios 键盘收起，但没有触发 window resize，导致实际页面dom仍然被键盘顶上去--错位
    document.addEventListener('focusout', () => {
      document.body.scrollTop = 0;
    });
  }

  // 监听resize事件（键盘弹起触发），然后将 input textarea 元素滑动到可视区域，并将特定元素隐藏
  private handleResize() {
    const clientHeight = document.documentElement.clientHeight;
    window.addEventListener('resize', () => {
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
    });
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

.router-view-c {
  position: absolute;
  transition: opacity 0.5s, transform 0.5s;
  width: 100%;
  height: 100%;
}

.forward-enter,
.back-leave-active {
  opacity: 0.5;
  transform: translateX(100%);
}

.forward-leave-active,
.back-enter {
  opacity: 0.5;
  transform: translateX(-100%);
}
</style>
