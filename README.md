# mobile-web-best-practice

移动端 web 最佳实践，基于 vue-cli3 搭建的 typescript 项目，可以用于 hybrid 应用或者纯 webapp 开发。以下大部分内容同样适用于 react 等前端框架。

[Demo 地址](https://mcuking.github.io/mobile-web-best-practice/)

也可手机浏览器扫码体验：
<img src="./demo_url.png" width="160">

## 组件库

[vant](https://youzan.github.io/vant/#/zh-CN/intro)

[vux](https://github.com/airyland/vux)

[mint-ui](https://github.com/ElemeFE/mint-ui)

[cube-ui](https://github.com/didi/cube-ui)

vue 移动端组件库目前主要就是上面罗列的这几个库，本项目使用的是有赞前端团队开源的 [vant](https://youzan.github.io/vant/#/zh-CN/intro)。

vant 官方目前已经支持自定义样式主题，本项目也采用了该方式，请查看相关文档：

[定制主题](https://youzan.github.io/vant/#/zh-CN/theme)

推荐一篇介绍各个组件库特点的文章：

[Vue 常用组件库的比较分析（移动端）](https://blog.csdn.net/weixin_38633659/article/details/89736656)

## JSBridge

[DSBridge-IOS](https://github.com/wendux/DSBridge-IOS)

[DSBridge-Android](https://github.com/wendux/DSBridge-Android)

[WebViewJavascriptBridge](https://github.com/marcuswestin/WebViewJavascriptBridge)

混合应用中一般都是通过 webview 加载网页，而当网页要获取设备能力（例如调用摄像头、本地日历等）或者 native 需要调用网页里的方法，就需要通过 JSBridge 进行通信。

开源社区中有很多功能强大的 JSBridge，例如上面列举的库。本项目基于保持 iOS android 平台接口统一原因，采用了 DSBridge，各位可以选择适合自己项目的工具。

推荐一个基于安卓平台实现的教学版 JSBridge，里面详细阐述了如何基于底层接口如何一步步封装一个可用的 JSBridge：

[JSBridge 实现原理](https://github.com/mcuking/JSBridge)

## 路由堆栈管理(模拟原生 APP 导航)

[vue-page-stack](https://github.com/hezhongfeng/vue-page-stack)

[vue-navigation](https://github.com/zack24q/vue-navigation)

[vue-stack-router](https://github.com/luojilab/vue-stack-router)

在使用 h5 开发 app，总会遇到类似需求，从列表进入详情页，返回后能够记住当前位置，或者从表单点击某项进入到其他页面选择，然后回到表单页，需要记住之前表单填写的数据。可是目前 vue 或 react 框架的路由，均不支持同时存在两个页面，所以需要路由堆栈进行管理。

其中 [vue-page-stack](https://github.com/hezhongfeng/vue-page-stack) 和 [vue-navigation](https://github.com/zack24q/vue-navigation) 均受 vue 的 keepalive 启发，基于 vue-router，当进入某个页面时，会查看当前页面是否有缓存，有缓存的话就取出缓存，并且清除排在他后面的所有 vnode，没有缓存就是新的页面，需要存储或者是 replace 当前页面，向栈里面 push 对应的 vnode，从而实现记住页面状态的功能。

而逻辑思维前端团队的 [vue-stack-router](https://github.com/luojilab/vue-stack-router) 则另辟蹊径，抛开了 [vue-router](https://router.vuejs.org/)，自己独立实现了路由管理，相较于 vue-router，主要是支持同时可以存活 A 和 B 两个页面的实例，或者 A 页面不同状态的两个实例，并支持原生左滑功能。但由于项目还在初期完善，功能还没有 vue-router 强大，建议持续关注后续动态再做决定是否引入。

本项目使用的是 [vue-page-stack](https://github.com/hezhongfeng/vue-page-stack)。同时推荐两片相关文章：

[【vue-page-stack】Vue 单页应用导航管理器 正式发布](https://juejin.im/post/5d2ef417f265da1b971aa94f)

[Vue 社区的路由解决方案：vue-stack-router](https://juejin.im/post/5d4ce4fd6fb9a06acd450e8c)

## 请求数据缓存

[mem](https://github.com/sindresorhus/mem)

在我们的应用中，会存在一些很少改动的数据，而这些数据有需要从后端获取，比如公司人员、公司职位分类等，此类数据在很长一段时间时不会改变的，而每次打开页面或切换页面时，就重新向后端请求。为了能够减少不必要请求，加快页面渲染速度，可以引用 [mem](https://github.com/sindresorhus/mem) 缓存库。

[mem](https://github.com/sindresorhus/mem) 基本原理是通过以接收的函数为 key 创建一个 WeakMap，然后再以函数参数为 key 创建一个 Map，value 就是函数的执行结果，同时将这个 Map 作为刚刚的 WeakMap 的 value 形成嵌套关系，从而实现对同一个函数不同参数进行缓存。而且支持传入 maxAge，即数据的有效期，当某个数据到达有效期后，会自动销毁，避免内存泄漏。

[mem](https://github.com/sindresorhus/mem) 作为高阶函数，可以直接接受封装好的接口请求。但是为了更加直观简便，我们可以按照类的形式集成我们的接口函数，然后就可以用装饰器的形式使用 mem 了。下面是相关代码：

```javascript
import http from '../http';
import mem from 'mem';

/**
 * @param {MemOption} - mem 配置项
 * @return {Function} - 装饰器
 */
export default function m(options: AnyObject) {
  return (target: AnyObject, name: string, descriptor: PropertyDescriptor) => {
    const oldValue = descriptor.value;
    descriptor.value = mem(oldValue, options);
    return descriptor;
  };
}

class Home {
  @m({ maxAge: 60 * 1000 })
  public async getUnderlingDailyList(
    query: ListQuery
  ): Promise<{ total: number; list: DailyItem[] }> {
    const {
      data: { total, list }
    } = await http({
      method: 'post',
      url: '/daily/getList',
      data: query
    });

    return { total, list };
  }
}

export default new Home();
```

## 样式

[postcss-px-to-viewport](https://github.com/evrone/postcss-px-to-viewport)

todo

## 表单

[async-validator](https://github.com/yiminghe/async-validator)

todo

## 打包策略

todo

## 微前端

[qianlun](https://github.com/umijs/qiankun)

todo

## 领域驱动设计应用

[ddd-fe-demo](https://github.com/Vincedream/ddd-fe-demo)

todo

## mock 数据

[Mock](https://github.com/nuysoft/Mock)

当前后端进度不一致，接口还尚未实现时，为了不影响彼此的进度，此时前后端约定好接口数据格式后，前端就可以使用 mock 数据进行独立开发了。本项目使用了 [Mock](https://github.com/nuysoft/Mock) 实现前端所需的接口。

## 调试控制台

[eruda](https://github.com/liriliri/eruda)

[vconsole](https://github.com/Tencent/vConsole)

在调试方面，本项目使用 [eruda](https://github.com/liriliri/eruda) 作为手机端调试面板，功能相当于打开 PC 控制台，可以很方便地查看 console, network, cookie, localStorage 等关键调试信息。与之类似地工具还有微信的前端研发团队开发的 [vconsole](https://github.com/Tencent/vConsole)，各位可以选择适合自己项目的工具。

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

[fiddler](https://www.telerik.com/fiddler)

虽然有了 eruda 调试工具，但某些情况下仍不能满足需求，比如现网完全关闭 eruda 等情况。

此时就需要抓包工具，相关工具主要就是上面罗列的这两个，各位可以选择适合自己项目的工具。

通过 charles 可以清晰的查看所有请求的信息(注：https 下抓包需要在手机上配置相关证书)。当然 charles 还有更多强大功能，比例模拟弱网情况，资源映射等。

推荐一篇不错的 charles 使用教程：

[解锁 Charles 的姿势](https://juejin.im/post/5a1033d2f265da431f4aa81f)

## 异常监控平台

[sentry](https://github.com/getsentry/sentry)

[fundebug](https://www.fundebug.com/)

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

## 性能监控平台

todo

## 常见问题

- **iOS WKWebView cookie 写入慢以及易丢失**

  **现象：**

  1. iOS 登陆后立即进入网页，会出现 cookie 获取不到或获取的上一次登陆缓存的 cookie
  2. 重启 App 后，cookie 会丢失

  **原因：**
  WKWebView 对 NSHTTPCookieStorage 写入 cookie，不是实时存储的。从实际的测试中发现，不同的 IOS 版本，延迟的时间还不一样。同样，发起请求时，也不是实时读取，无法做到和 native 同步，导致页面逻辑出错。

  **两种解决办法：**

  1. 客户端手动干预一下 cookie 的存储。将服务响应的 cookie，持久化到本地，在下次 webview 启动时，读取本地的 cookie 值，手动再去通过 native 往 webview 写入。但是偶尔还有 spa 的页面路由切换的时候丢失 cookie 的问题。
  2. 将 cookie 存储的 session 持久化到 localSorage，每次请求时都会取 localSorage 存储的 session，并在请求头部添加 cookieback 字段，服务端鉴权时，优先校验 cookieback 字段。这样即使 cookie 丢失或存储的上一次的 session，都不会有影响。不过这种方式相当于绕开了 cookie 传输机制，无法享受 这种机制带来的安全特性。

  各位可以选择适合自己项目的方式，有更好的处理方式欢迎留言。

* **input 标签在部分安卓 webview 上无法实现上传图片功能**

  因为 Android 的版本碎片问题，很多版本的 WebView 都对唤起函数有不同的支持。我们需要重写 WebChromeClient 下的 openFileChooser()（5.0 及以上系统回调 onShowFileChooser()）。我们通过 Intent 在 openFileChooser()中唤起系统相机和支持 Intent 的相关 app。

  相关文章：
  [【Android】WebView 的 input 上传照片的兼容问题](https://juejin.im/post/5a322cdef265da43176a2913)

* **input 标签在 iOS 上唤起软键盘，键盘收回后页面不回落（部分情况页面看上去已经回落，实际结构并未回落）**

  input 焦点失焦后，ios 软键盘收起，但没有触发 window resize，导致实际页面 dom 仍然被键盘顶上去--错位。
  解决办法：全局监听 input 失焦事件，当触发事件后，将 body 的 scrollTop 设置为 0。

  ```javascript
  document.addEventListener('focusout', () => {
    document.body.scrollTop = 0;
  });
  ```

* **唤起软键盘后会遮挡输入框**

  当 input 或 textarea 获取焦点后，软键盘会遮挡输入框。
  解决办法：全局监听 window 的 resize 事件，当触发事件后，获取当前 active 的元素并检验是否为 input 或 textarea 元素，如果是则调用元素的 scrollIntoViewIfNeeded 即可。

  ```javascript
  window.addEventListener("resize", () => {
    // 判断当前 active 的元素是否为 input 或 textarea
    if (
      document.activeElement!.tagName === "INPUT" ||
      document.activeElement!.tagName === "TEXTAREA"
    ) {
      setTimeout(() => {
        // 原生方法，滚动至需要显示的位置
        document.activeElement!.scrollIntoView();
      }, 0);
    }
  });
  ```

* **唤起键盘后 `position: fixed;bottom: 0px;` 元素被键盘顶起**

  解决办法：全局监听 window 的 resize 事件，当触发事件后，获取 id 名为 fixed-bottom 的元素（可提前约定好如何区分定位在窗口底部的元素），将其设置成 `display: none`。键盘收回时，则设置成 `display: block;`。

  ```javascript
  const clientHeight = document.documentElement.clientHeight;
  window.addEventListener("resize", () => {
    const bodyHeight = document.documentElement.clientHeight;
    const ele = document.getElementById('fixed-bottom');
    if (clientHeight > bodyHeight) {
      (ele as HTMLElement).style.display = 'none';
    } else {
      (ele as HTMLElement).style.display = 'block';
    }
  });
  ```

- **webview 通过 loadUrl 加载的页面运行时却通过第三方浏览器打开，代码如下**

  ```java
  // 创建一个 Webview
  Webview webview = (Webview) findViewById(R.id.webView);
  // 调用 Webview loadUrl
  webview.loadUrl("http://www.baidu.com/");
  ```

  解决办法：在调用 loadUrl 之前，设置下 WebviewClient 类，当然如果需要也可自己实现 WebviewClient（例如通过拦截 prompt 实现 js 与 native 的通信）

  ```java
  webview.setWebViewClient(new WebViewClient());
  ```
