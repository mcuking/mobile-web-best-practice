# mobile-web-best-practice

移动端 web 最佳实践，基于 vue-cli3 搭建的 typescript 项目，以下大部分内容同样适用于 react 等前端框架。

## 组件库

[vant](https://youzan.github.io/vant/#/zh-CN/intro)

vue 移动端组件库目前主要有 vux, mint ui, vant, cube-ui 等，本项目使用的是有赞前端团队开源的 vant。

vant 官方目前已经支持自定义样式主题，本项目也采用了该方式，请查看相关文档：

[定制主题](https://youzan.github.io/vant/#/zh-CN/theme)

下面推荐一篇介绍各个组件库特点的文章：

[Vue 常用组件库的比较分析（移动端）](https://blog.csdn.net/weixin_38633659/article/details/89736656)

## JSBridge

[DSBridge-IOS](https://github.com/wendux/DSBridge-IOS)

[DSBridge-Android](https://github.com/wendux/DSBridge-Android)

混合应用中一般都是通过 webview 加载网页，而当网页要获取设备能力（例如调用摄像头、本地日历等）或者 native 需要调用网页里的方法，就需要通过 JSBridge 进行通信。

开源社区中有很多功能强大的 JSBridge，例如 [WebViewJavascriptBridge](https://github.com/marcuswestin/WebViewJavascriptBridge), [DSBridge-Android](https://github.com/wendux/DSBridge-Android), [DSBridge-IOS](https://github.com/wendux/DSBridge-IOS) 等，各位可以选择适合自己项目的工具。

下面推荐一个基于安卓平台实现的教学版 JSBridge，里面详细阐述了如何基于底层接口如何一步步封装一个可用的 JSBridge：

[JSBridge 实现原理](https://github.com/mcuking/JSBridge)

## 样式

todo

## 表单

todo

## 领域驱动设计应用

todo

## 调试控制台

[eruda](https://github.com/liriliri/eruda)

在调试方面，本项目使用 eruda 作为手机端调试面板，功能相当于打开 PC 控制台，可以很方便地查看 console, network, cookie, localStorage 等关键调试信息。与之类似地工具还有微信的前端研发团队开发的 [vconsole](https://github.com/Tencent/vConsole)，各位可以选择适合自己项目的工具。

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

## 抓包工具

[charles](https://www.charlesproxy.com/)

虽然有了 eruda 调试工具，但某些情况下仍不能满足需求，比如现网完全关闭 eruda 等情况。

此时就需要抓包工具，相关工具有 [charles](https://www.charlesproxy.com/) 和 [fiddler](https://www.telerik.com/fiddler) 等，各位可以选择适合自己项目的工具。

通过 charles 可以清晰的查看所有请求的信息(注：https 下抓包需要在手机上配置相关证书)。当然 charles 还有更多强大功能，比例模拟弱网情况，资源映射等。

下面推荐一篇不错的 charles 使用教程：

[解锁 Charles 的姿势](https://juejin.im/post/5a1033d2f265da431f4aa81f)

## 异常监控平台

[sentry](https://github.com/getsentry/sentry)

移动端网页相对 PC 端，主要有设备众多，网络条件各异，调试困难等特点。导致如下问题：

- 设备兼容或网络异常导致只有部分情况下才出现的 bug，测试无法全面覆盖

- 无法获取出现 bug 的用户的设备，又不能复现反馈的 bug

- 部分 bug 只出现几次，后面无法复现，不能还原事故现场

这时就非常需要一个异常监控平台，将异常实时上传到平台，并及时通知相关人员。

相关工具有 [sentry](https://github.com/getsentry/sentry)，[fundebug](https://www.fundebug.com/) 等，各位可以选择适合自己项目的工具。下面是 sentry 在本项目应用时使用的相关配套工具。

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

## 性能监控平台

todo

## 常见问题

- **iOS wkwebview cookie 写入慢以及易丢失问题**
  todo

- **input 标签在部分安卓 webview 上无法实现上传图片功能**
  因为 Android 的版本碎片问题，很多版本的 WebView 都对唤起函数有不同的支持。我们需要重写 WebChromeClient 下的 openFileChooser()（5.0 及以上系统回调 onShowFileChooser()）。我们通过 Intent 在 openFileChooser()中唤起系统相机和支持 Intent 的相关 app。相关文章：
  [【Android】WebView 的 input 上传照片的兼容问题](https://juejin.im/post/5a322cdef265da43176a2913)

- **input 标签在 iOS 上唤起软键盘，键盘收回后页面不回落（部分情况页面看上去已经回落，实际结构并未回落）**
  input 焦点失焦后，ios 软键盘收起，但没有触发 window resize，导致实际页面 dom 仍然被键盘顶上去--错位
  解决办法：可全局监听 input 失焦事件，当触发事件后，将 body 的 scrollTop 设置为 0
  ```javascript
  document.addEventListener('focusout', () => {
    document.body.scrollTop = 0;
  });
  ```
