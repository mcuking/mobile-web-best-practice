# mobile-web-best-practice

移动端 web 最佳实践，基于 vue-cli3 搭建的 typescript 项目，可以用于 hybrid 应用或者纯 webapp 开发。以下大部分内容同样适用于 [react](https://reactjs.org/) 等前端框架。

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

推荐一个笔者之前写的一个基于安卓平台实现的教学版 [JSBridge](https://github.com/mcuking/JSBridge)，里面详细阐述了如何基于底层接口一步步封装一个可用的 JSBridge：

[JSBridge 实现原理](https://github.com/mcuking/JSBridge)

## 路由堆栈管理(模拟原生 APP 导航)

[vue-page-stack](https://github.com/hezhongfeng/vue-page-stack)

[vue-navigation](https://github.com/zack24q/vue-navigation)

[vue-stack-router](https://github.com/luojilab/vue-stack-router)

在使用 h5 开发 app，会经常遇到下面的需求：
从列表进入详情页，返回后能够记住当前位置，或者从表单点击某项进入到其他页面选择，然后回到表单页，需要记住之前表单填写的数据。可是目前 vue 或 [react](https://reactjs.org/) 框架的路由，均不支持同时存在两个页面实例，所以需要路由堆栈进行管理。

其中 [vue-page-stack](https://github.com/hezhongfeng/vue-page-stack) 和 [vue-navigation](https://github.com/zack24q/vue-navigation) 均受 [vue](https://cn.vuejs.org/) 的 keepalive 启发，基于 [vue-router](https://router.vuejs.org/)，当进入某个页面时，会查看当前页面是否有缓存，有缓存的话就取出缓存，并且清除排在他后面的所有 vnode，没有缓存就是新的页面，需要存储或者是 replace 当前页面，向栈里面 push 对应的 vnode，从而实现记住页面状态的功能。

而逻辑思维前端团队的 [vue-stack-router](https://github.com/luojilab/vue-stack-router) 则另辟蹊径，抛开了 [vue-router](https://router.vuejs.org/)，自己独立实现了路由管理，相较于 [vue-router](https://router.vuejs.org/)，主要是支持同时可以存活 A 和 B 两个页面的实例，或者 A 页面不同状态的两个实例，并支持原生左滑功能。但由于项目还在初期完善，功能还没有 [vue-router](https://router.vuejs.org/) 强大，建议持续关注后续动态再做决定是否引入。

本项目使用的是 [vue-page-stack](https://github.com/hezhongfeng/vue-page-stack)。同时推荐两片相关文章：

[【vue-page-stack】Vue 单页应用导航管理器 正式发布](https://juejin.im/post/5d2ef417f265da1b971aa94f)

[Vue 社区的路由解决方案：vue-stack-router](https://juejin.im/post/5d4ce4fd6fb9a06acd450e8c)

## 请求数据缓存

[mem](https://github.com/sindresorhus/mem)

在我们的应用中，会存在一些很少改动的数据，而这些数据有需要从后端获取，比如公司人员、公司职位分类等，此类数据在很长一段时间时不会改变的，而每次打开页面或切换页面时，就重新向后端请求。为了能够减少不必要请求，加快页面渲染速度，可以引用 [mem](https://github.com/sindresorhus/mem) 缓存库。

[mem](https://github.com/sindresorhus/mem) 基本原理是通过以接收的函数为 key 创建一个 WeakMap，然后再以函数参数为 key 创建一个 Map，value 就是函数的执行结果，同时将这个 Map 作为刚刚的 WeakMap 的 value 形成嵌套关系，从而实现对同一个函数不同参数进行缓存。而且支持传入 maxAge，即数据的有效期，当某个数据到达有效期后，会自动销毁，避免内存泄漏。

选择 WeakMap 是因为其相对 Map 保持对键名所引用的对象是弱引用，即垃圾回收机制不将该引用考虑在内。只要所引用的对象的其他引用都被清除，垃圾回收机制就会释放该对象所占用的内存。也就是说，一旦不再需要，WeakMap 里面的键名对象和所对应的键值对会自动消失，不用手动删除引用。

[mem](https://github.com/sindresorhus/mem) 作为高阶函数，可以直接接受封装好的接口请求。但是为了更加直观简便，我们可以按照类的形式集成我们的接口函数，然后就可以用装饰器的方式使用 mem 了（装饰器只能修饰类和类的类的方法，因为普通函数会存在变量提升）。下面是相关代码：

```ts
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

[qiankun](https://github.com/umijs/qiankun)

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

关于 [eruda](https://github.com/liriliri/eruda) 使用，推荐使用 cdn 方式加载，至于什么时候加载 [eruda](https://github.com/liriliri/eruda) ，可以根据不同项目制定不同策略。示例代码如下：

```ts
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

虽然有了 [eruda](https://github.com/liriliri/eruda) 调试工具，但某些情况下仍不能满足需求，比如现网完全关闭 [eruda](https://github.com/liriliri/eruda) 等情况。

此时就需要抓包工具，相关工具主要就是上面罗列的这两个，各位可以选择适合自己项目的工具。

通过 [charles](https://www.charlesproxy.com/) 可以清晰的查看所有请求的信息(注：https 下抓包需要在手机上配置相关证书)。当然 [charles](https://www.charlesproxy.com/) 还有更多强大功能，比例模拟弱网情况，资源映射等。

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

相关工具有 [sentry](https://github.com/getsentry/sentry)，[fundebug](https://www.fundebug.com/) 等，其中 sentry 因为功能强大，支持多平台监控（不仅可以监控前端项目），完全开源，可以私有化部署等特点，而被广泛采纳。

下面是 [sentry](https://github.com/getsentry/sentry) 在本项目应用时使用的相关配套工具。

**sentry 针对 javascript 的 sdk**

[sentry-javascript](https://github.com/getsentry/sentry-javascript)

**自动上传 sourcemap 的 webpack 插件**

[sentry-webpack-plugin](https://github.com/getsentry/sentry-webpack-plugin)

**编译时自动在 try catch 中添加错误上报函数的 babel 插件**

[babel-plugin-try-catch-error-report](https://github.com/mcuking/babel-plugin-try-catch-error-report)

**补充：**

前端的异常主要有以下几个部分：

- 静态资源加载异常

- 接口异常（包括与后端和 native 的接口）

- js 报错

- 网页崩溃

其中静态资源加载失败，可以通过 window.addEventListener('error', ..., true) 在事件捕获阶段获取，然后筛选出资源加载失败的错误并手动上报错误。核心代码如下：

```ts
// 全局监控资源加载错误
window.addEventListener(
  'error',
  event => {
    // 过滤 js error
    const target = event.target || event.srcElement;
    const isElementTarget =
      target instanceof HTMLScriptElement ||
      target instanceof HTMLLinkElement ||
      target instanceof HTMLImageElement;
    if (!isElementTarget) {
      return false;
    }
    // 上报资源地址
    const url = (target as any).src || (target as any).href;

    this.log({
      error: new Error(`ResourceLoadError: ${url}`),
      type: 'resource load'
    });
  },
  true
);
```

关于服务端接口异常，可以通过在封装的 http 模块中，全局集成上报错误函数。核心代码如下：

```ts
function errorReport(
  url: string,
  error: string | Error,
  requestOptions: AxiosRequestConfig,
  response?: AnyObject
) {
  if (window.$sentry) {
    const errorInfo: RequestErrorInfo = {
      error: typeof error === 'string' ? new Error(error) : error,
      type: 'request',
      requestUrl: url,
      requestOptions: JSON.stringify(requestOptions)
    };

    if (response) {
      errorInfo.response = JSON.stringify(response);
    }

    window.$sentry.log(errorInfo);
  }
}
```

关于全局 js 报错，sentry 针对的前端的 sdk -- @sentry/browser 已经通过 window.onerror 和 window.addEventListener('unhandledrejection', ..., false) 进行全局监听并上报。

需要注意的是其中 window.onerror = (message, source, lineno, colno, error) =>{} 不同于 window.addEventListener('error', ...)，window.onerror 捕获的信息更丰富，包括了错误字符串信息、发生错误的 js 文件，错误所在的行数、列数、和 Error 对象（其中还会有调用堆栈信息等）。所以 sentry 会选择 window.onerror 进行 js 全局监控。

但有一种错误是 window.onerror 监听不到的，那就是 unhandledrejection 错误，这个错误是当 promise reject 后没有 catch 住所引起的。当然 sentry 的 sdk 也已经做了监听。

针对 vue 项目，也可对 errorHandler 钩子进行全局监听，react 的话可以通过 componentDidCatch 钩子，vue 相关代码如下：

```ts
// 全局监控 Vue errorHandler
Vue.config.errorHandler = (error, vm, info) => {
  window.$sentry.log({
    error,
    type: 'vue errorHandler',
    vm,
    info
  });
};
```

但是对于我们业务中，经常会对一些以报错代码使用 try catch，这些错误如果没有在 catch 中向上抛出，是无法通过 window.onerror 捕获的，针对这种情况，笔者开发了一个 babel 插件 [babel-plugin-try-catch-error-report](https://github.com/mcuking/babel-plugin-try-catch-error-report)，该插件可以在 [babel](https://babeljs.io/) 编译 js 的过程中，通过在 ast 中查找 catch 节点，然后再 catch 代码块中自动插入错误上报函数，可以自定义函数名，和上报的内容（源码所在文件，行数，列数，调用栈，以及当前 window 属性，比如当前路由信息 window.location.href）。相关配置代码如下：

```js
if (!IS_DEV) {
  plugins.push([
    'try-catch-error-report',
    {
      expression: 'window.$sentry.log',
      needFilename: true,
      needLineNo: true,
      needColumnNo: false,
      needContext: true,
      exclude: ['node_modules']
    }
  ]);
}
```

针对跨域 js 问题，当加载的不同域的 js 文件时，例如通过 cdn 加载打包后的 js。如果 js 报错，window.onerror 只能捕获到 script error，没有任何有效信息能帮助我们定位问题。此时就需要我们做一些事情：
第一步、服务端需要在返回 js 的返回头设置 Access-Control-Allow-Origin: \*
第二部、设置 script 标签属性 crossorigin，代码如下：

```html
<script src="http://helloworld/main.js" crossorigin></script>
```

如果是动态添加的，也可动态设置：

```js
const script = document.createElement('script');
script.crossOrigin = 'anonymous';
script.src = url;
document.body.appendChild(script);
```

针对网页崩溃问题，推荐一个基于 service work 的监控方案，相关文章已列在下面的。如果是 webview 加载网页，也可以通过 webview 加载失败的钩子监控网页崩溃等。

[如何监控网页崩溃？](https://juejin.im/entry/5be158116fb9a049c6434f4a)

最后，因为部署到线上的代码一般都是经过压缩混淆的，如果没有上传 sourcemap 的话，是无法定位到具体源码的，可以现在 项目中添加 .sentryclirc 文件，其中内容可参考本项目的 .sentryclirc，然后通过 sentry-cli (需要全局全装 sentry-cli 即`npm install sentry-cli`)命令行工具进行上传，命令如下：

```
sentry-cli releases -o 机构名 -p 项目名 files 版本 upload-sourcemaps sourcemap 文件相对位置 --url-prefix js 在线上相对根目录的位置 --rewrite
// 示例
sentry-cli releases -o mcukingdom -p hello-world files 0.2.1 upload-sourcemaps dist/static/js --url-prefix '~/static/js/' --rewrite
```

当然官方也提供了 webpack 插件 [sentry-webpack-plugin](https://github.com/getsentry/sentry-webpack-plugin)，当打包时触发 webpack 的 after-emit 事件钩子（即生成资源到 output 目录之后），插件会自动上传打包目录中的 sourcemap 和关联的 js，相关配置可参考本项目的 vue.config.js 文件。

通常为了安全，是不允许在线上部署 sourcemap 文件的，所以上传 sourcemap 到 sentry 后，可手动删除线上 sourcemap 文件。

## 性能监控平台

[performance](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/performance)

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

- **input 标签在部分安卓 webview 上无法实现上传图片功能**

  因为 Android 的版本碎片问题，很多版本的 WebView 都对唤起函数有不同的支持。我们需要重写 WebChromeClient 下的 openFileChooser()（5.0 及以上系统回调 onShowFileChooser()）。我们通过 Intent 在 openFileChooser()中唤起系统相机和支持 Intent 的相关 app。

  相关文章：
  [【Android】WebView 的 input 上传照片的兼容问题](https://juejin.im/post/5a322cdef265da43176a2913)

- **input 标签在 iOS 上唤起软键盘，键盘收回后页面不回落（部分情况页面看上去已经回落，实际结构并未回落）**

  input 焦点失焦后，ios 软键盘收起，但没有触发 window resize，导致实际页面 dom 仍然被键盘顶上去--错位。
  解决办法：全局监听 input 失焦事件，当触发事件后，将 body 的 scrollTop 设置为 0。

  ```ts
  document.addEventListener('focusout', () => {
    document.body.scrollTop = 0;
  });
  ```

- **唤起软键盘后会遮挡输入框**

  当 input 或 textarea 获取焦点后，软键盘会遮挡输入框。
  解决办法：全局监听 window 的 resize 事件，当触发事件后，获取当前 active 的元素并检验是否为 input 或 textarea 元素，如果是则调用元素的 scrollIntoViewIfNeeded 即可。

  ```ts
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
  });
  ```

- **唤起键盘后 `position: fixed;bottom: 0px;` 元素被键盘顶起**

  解决办法：全局监听 window 的 resize 事件，当触发事件后，获取 id 名为 fixed-bottom 的元素（可提前约定好如何区分定位在窗口底部的元素），将其设置成 `display: none`。键盘收回时，则设置成 `display: block;`。

  ```ts
  const clientHeight = document.documentElement.clientHeight;
  window.addEventListener('resize', () => {
    const bodyHeight = document.documentElement.clientHeight;
    const ele = document.getElementById('fixed-bottom');
    if (clientHeight > bodyHeight) {
      (ele as HTMLElement).style.display = 'none';
    } else {
      (ele as HTMLElement).style.display = 'block';
    }
  });
  ```

- **点击网页输入框会导致网页放大**
  通过 viewport 设置 user-scalable=no 即可，（注意：当 user-scalable=no 时，无需设置 minimum-scale=1, maximum-scale=1，因为已经禁止了用户缩放页面了，允许的缩放范围也就不存在了）。代码如下：

  ```html
  <meta
    name="viewport"
    content="width=device-width,initial-scale=1.0,user-scalable=0,viewport-fit=cover"
  />
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
