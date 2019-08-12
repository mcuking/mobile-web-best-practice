# mobile-web-best-practice

下面是本项目中使用的技术

### 前端框架

[vue](https://github.com/vuejs/vue)

[vue-router](https://github.com/vuejs/vue-router)

[vuex](https://github.com/vuejs/vuex)

本项目使用的是 vue 全家桶，但下面绝大部分内容同样适用其他框架，比如 react 等。

### 组件库

[vant](https://youzan.github.io/vant/#/zh-CN/intro)

vue 移动端组件库目前主要有 vux, mint ui, vant, cube-ui 等，本项目使用的是有赞前端团队开源的 vant。

下面推荐一篇介绍各个组件库特点的文章：

[Vue 常用组件库的比较分析（移动端）](https://blog.csdn.net/weixin_38633659/article/details/89736656)

### JSBridge

[DSBridge-IOS](https://github.com/wendux/DSBridge-IOS)

[DSBridge-Android](https://github.com/wendux/DSBridge-Android)

下面推荐一个基于安卓平台实现的 JSBridge，里面详细阐述了如何基于底层接口如何一步步封装一个可用的 JSBridge：

[JSBridge 实现原理](https://github.com/mcuking/JSBridge)

**补充：**

native 调用 js 方法：

- loadUrl

- evaluateJavascript

js 调用 native 方法：

- 拦截 Url Schema

- 拦截 prompt alert confirm

- 注入 JS 上下文

### 样式

todo

### 表单

todo

### 领域驱动设计

todo

### 调试控制台

[eruda](https://github.com/liriliri/eruda)

在调试方面，本项目使用 eruda 作为手机端调试面板，功能相当于打开 PC 控制台，可以很方便地查看 console, network, cookie, localStorage 等关键调试信息。与之类似地工具还有微信的前端研发团队开发的 vconsole，各位可以选择适合自己项目的工具。

关于 eruda 使用，推荐使用 cdn 方式加载，至于什么时候加载 eruda，可以根据不同项目制定不同策略。示例代码如下：

```javascript
<script>
  (function() {
    const NO_ERUDA = window.location.protocol === 'https:';
    if (NO_ERUDA) return;
    const src = 'https://cdn.jsdelivr.net/npm/eruda@1.5.8/eruda.min.js';
    document.write('<scr' + 'ipt src="' + src + '"></scr' + 'ipt>');
    document.write('<scr' + 'ipt>eruda.init();</scr' + 'ipt>');
  })();
</script>
```

#### 抓包工具

[charles](https://www.charlesproxy.com/)

虽然有了 eruda 调试工具，但某些情况下仍不能满足需求，比如现网完全关闭 eruda 等情况。

此时就需要抓包工具，相关工具有 charles 和 fiddler 等，各位可以选择适合自己项目的工具。

通过 charles 可以清晰的查看所有请求的信息(注：https 下抓包需要在手机上配置相关证书)。当然 charles 还有更多强大功能，比例模拟弱网情况，资源映射等。

下面推荐一篇不错的 charles 使用教程：

[解锁 Charles 的姿势](https://juejin.im/post/5a1033d2f265da431f4aa81f)

### 异常监控平台

[sentry](https://github.com/getsentry/sentry)

移动端网页相对 PC 端，主要有设备众多，网络条件各异，调试困难等特点。导致如下问题：

- 设备兼容或网络异常导致只有部分情况下才出现的 bug，测试无法全面覆盖

- 无法获取出现 bug 的用户的设备，又不能复现反馈的 bug

- 部分 bug 只出现几次，后面无法复现，不能还原事故现场

这时就非常需要一个异常监控平台，将异常实时上传到平台，并及时通知相关人员。

相关工具有 sentry，fundebug 等，各位可以选择适合自己项目的工具。下面是 sentry 在本项目应用时使用的相关配套工具。

**sentry 针对 javascript 的 sdk**

[sentry-javascript](https://github.com/getsentry/sentry-javascript)

**sourcemap 自动上传 webpack 插件**

[sentry-webpack-plugin](https://github.com/getsentry/sentry-webpack-plugin)

**编译时自动添加错误上报函数的 babel 插件**

[babel-plugin-try-catch-error-report](https://github.com/mcuking/babel-plugin-try-catch-error-report)

**补充：**

前端的异常主要分成如下三部分：

- 静态资源加载异常

- 接口异常（包括与后端和 native 的接口）

- js 报错

### 性能监控平台

todo

### 常见问题

#### iOS wkwebview cookie 写入慢以及易丢失问题

todo
