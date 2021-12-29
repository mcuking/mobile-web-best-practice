# mobile-web-best-practice

> 本项目以基于 [vue-cli3](https://cli.vuejs.org/) 和 [typescript](http://www.typescriptlang.org/) 搭建的 Todo 应用为例，阐述了在使用 web 进行移动端开发中的一些最佳实践方案(并不局限于 [Vue](https://cn.vuejs.org/) 框架)。另外其中很多方案同样适用于 PC 端 Web 开发。

笔者会不定期地将实践中的最佳方案更新到本项目中。

## 在线体验

该 Todo 应用交互简洁实用，另外无需服务器，而是将数据保存到 webview 的 indexDB 中，可保证数据安全，欢迎在实际工作生活中使用。效果图如下：

<img src="https://i.loli.net/2020/02/29/oIO5UfnqlGgzmQ8.gif" width=320/>

| 体验平台 | 二维码                                                                    | 链接                                            | 备注             |
| -------- | ------------------------------------------------------------------------- | ----------------------------------------------- | ---------------- |
| Web      | <img src="https://i.loli.net/2020/11/08/IbAfiwedsGRl3hF.png"  width=140/> | [点击体验](http://122.51.132.117)            |                  |
| Android  | <img src="https://i.loli.net/2020/02/29/wEqfsCRKnI2XP7V.png" width=140/>  | [点击体验](https://www.pgyer.com/mwbpcontainer) | 安装密码：123456 |

## 目录

- [分层架构](#分层架构)
- [微前端](#微前端)
- [离线包](#离线包)
- [JSBridge](#jsbridge)
- [异常监控](#异常监控)
- [页面状态保持](#页面状态保持)
- [请求数据缓存](#请求数据缓存)
- [限制原生接口调用](#限制原生接口调用)
- [样式适配](#样式适配)
- [表单校验](#表单校验)
- [手势库](#手势库)
- [Webpack 策略](#webpack-策略)
- [调试控制台](#调试控制台)
- [抓包工具](#抓包工具)
- [部署](#部署)
- [常见问题](#常见问题)

## 分层架构

[react-clean-architecture](https://github.com/eduardomoroni/react-clean-architecture)

[business-rules-package](https://github.com/fabriciomendonca/business-rules-package)

[ddd-fe-demo](https://github.com/Vincedream/ddd-fe-demo)

目前前端开发主要是以单页应用为主，当应用的业务逻辑足够复杂的时候，总会遇到类似下面的问题：

- 业务逻辑过于集中在视图层，导致多平台无法共用本应该与平台无关的业务逻辑，例如一个产品需要维护 Mobile 和 PC 两端，或者同一个产品有 Web 和 React Native 两端；

- 产品需要多人协作时，每个人的代码风格和对业务的理解不同，导致业务逻辑分布杂乱无章；

- 对产品的理解停留在页面驱动层面，导致实现的技术模型与实际业务模型出入较大，当业务需求变动时，技术模型很容易被摧毁；

- 过于依赖前端框架，导致如果重构进行框架切换时，需要重写所有业务逻辑并进行回归测试。

针对上面所遇到的问题，笔者学习了一些关于 DDD（领域驱动设计）、Clean Architecture 等知识，并收集了类似思想在前端方面的实践资料，形成了下面这种前端分层架构：

<img src="https://i.loli.net/2020/02/29/5RhfH3BYMb9wIOs.png" width=600/>

其中 View 层想必大家都很了解，就不在这里介绍了，重点介绍下下面三个层的含义：

### Services 层

Services 层是用来对底层技术进行操作的，例如封装 AJAX 请求,操作浏览器 cookie、locaStorage、indexDB，操作 native 提供的能力（如调用摄像头等），以及建立 Websocket 与后端进行交互等。

其中 Services 层又可细分出 request 层和 translator 层， request 层主要是实现 Services 的大部分功能。而 translator 层主要用于清洗从服务端或客户端接口返回的数据：删除部分数据、修改属性名、转化部分数据等，一般可定义成纯函数形式。下面以本项目实际代码为例进行讲解。

从后端获取 quote 数据:

```ts
export class CommonService implements ICommonService {
  @m({ maxAge: 60 * 1000 })
  public async getQuoteList(): Promise<IQuote[]> {
    const {
      data: { list }
    } = await http({
      method: 'post',
      url: '/quote/getList',
      data: {}
    });

    return list;
  }
}
```

向客户端日历中同步 Note 数据:

```ts
export class NativeService implements INativeService {
  // 同步到日历
  @limit(['android', 'ios'], '1.0.1')
  public syncCalendar(params: SyncCalendarParams, onSuccess: () => void): void {
    const cb = async (errCode: number) => {
      const msg = NATIVE_ERROR_CODE_MAP[errCode];

      Vue.prototype.$toast(msg);

      if (errCode !== 6000) {
        this.errorReport(msg, 'syncCalendar', params);
      } else {
        await onSuccess();
      }
    };

    dsbridge.call('syncCalendar', params, cb);
  }
  ...
}
```

从 indexDB 读取某个 Note 详情数据：

```ts
import { noteTranslator } from './translators';

export class NoteService implements INoteService {
  public async get(id: number): Promise<INotebook | undefined> {
    const db = await createDB();

    const notebook = await db.getFromIndex('notebooks', 'id', id);
    return noteTranslator(notebook!);
  }
}
```

其中，noteTranslator 就属于 translator 层，用于订正接口返回的 note 数据，定义如下：

```ts
export function noteTranslator(item: INotebook) {
  // item.themeColor = item.color;
  return item;
}
```

另外我们可以拓宽下思路，当后端 API 仍在开发的时候，我们可以使用 indexDB 等本地存储技术进行模拟，建立一个 note-indexDB 服务，先提供给上层 Interactors 层进行调用，当后端 API 开发好后，就可以创建一个 note-server 服务，来替换之前的服务。只要保证前后两个服务对外暴露的接口一致，另外与上层的 Interactors 层没有过度耦合，即可实现快速切换。

### Entities 层

实体 Entity 是领域驱动设计的核心概念，它是领域服务的载体，它定义了业务中某个个体的属性和方法。例如本项目中 Note 和 Notebook 都是实体。区分一个对象是否是实体，主要是看他是否有唯一的标志符（例如 id）。下面是本项目的实体 Note:

```ts
export default class Note {
  public id: number;
  public name: string;
  public deadline: Date | undefined;
  ...

  constructor(note: INote) {
    this.id = note.id;
    this.name = note.name;
    this.deadline = note.deadline;
    ...
  }

  public get isExpire() {
    if (this.deadline) {
      return this.deadline.getTime() < new Date().getTime();
    }
  }

  public get deadlineStr() {
    if (this.deadline) {
      return formatTime(this.deadline);
    }
  }
}
```

通过上面的代码可以看到，这里主要是以实体本身的属性以及派生属性为主，当然实体本身也可以具有方法，用于实现属于实体自身的业务逻辑（笔者认为业务逻辑可以分为两部分，一部分业务逻辑属于跟实体强相关的，应该通过在实体类中的方法实现。另一部分业务逻辑则更多的是实体之间的业务，则可以放在 Interactors 层中实现）。只是本项目中还没有涉及，在这里就不作更多说明了，有兴趣的可以参考下面列出来的笔者翻译的文章：[可扩展的前端#2--常见模式（译）](https://juejin.im/post/5d8ac00cf265da5b6a16844a)。

另外笔者认为并不是所有的实体都应该按上面那样封装成一个类，如果某个实体本身业务逻辑很简单，就没有必要进行封装，例如本项目中 Notebook 实体就没有做任何封装，而是直接在 Interactors 层调用 Services 层提供的 API。毕竟我们做这些分层最终的目的就是理顺业务逻辑，提升开发效率，所以没有必要过于死板。

### Interactors 层

Interactors 层是负责处理业务逻辑的层，主要是由业务用例组成。一般情况下 Interactor 是一个单例，它使我们能够存储一些状态并避免不必要的 HTTP 调用，提供一种重置应用程序状态属性的方法（例如：在失去修改记录时恢复数据），决定什么时候应该加载新的数据。

下面是本项目中 Common 的 Interactors 层提供的公共调用的业务：

```ts
class CommonInteractor {
  public static getInstance() {
    return this._instance;
  }

  private static _instance = new CommonInteractor(new CommonService());

  private _quotes: any;

  constructor(private _service: ICommonService) {}

  public async getQuoteList() {
    // 单例模式下，将一些基本固定不变的接口数据保存在内存中，避免重复调用
    // 但要注意避免内存泄露
    if (this._quotes !== undefined) {
      return this._quotes;
    }

    let response;

    try {
      response = await this._service.getQuoteList();
    } catch (error) {
      throw error;
    }

    this._quotes = response;
    return this._quotes;
  }
}
```

通过上面的代码可以看到，Sevices 层提供的类的实例主要是通过 Interactors 层的类的构造函数获取到，这样就可以达到两层之间解耦，实现快速切换 service 的目的了，当然这个和依赖注入 DI 还是有些差距的，不过已经满足了我们的需求。

另外 Interactors 层还可以获取 Entities 层提供的实体类，将实体类提供的与实体强相关的业务逻辑和 Interactors 层的业务逻辑融合到一起提供给 View 层，例如 Note 的 Interactors 层部分代码如下：

```ts
class NoteInteractor {
  public static getInstance() {
    return this._instance;
  }

  private static _instance = new NoteInteractor(
    new NoteService(),
    new NativeService()
  );

  constructor(
    private _service: INoteService,
    private _service2: INativeService
  ) {}

  public async getNote(notebookId: number, id: number) {
    try {
      const note = await this._service.get(notebookId, id);
      if (note) {
        return new Note(note);
      }
    } catch (error) {
      throw error;
    }
  }
}
```

当然这种分层架构并不是银弹，其主要适用的场景是：实体关系复杂，而交互相对模式化，例如企业软件领域。相反实体关系简单而交互复杂多变就不适合这种分层架构了。

在具体业务开发实践中，这种领域模型以及实体一般都是有后端同学确定的，我们需要做的是，和后端的领域模型保持一致，但不是一样。例如同一个功能，在前端只是一个简单的按钮，而在后端则可能相当复杂。

然后需要明确的是，架构和项目文件结构并不是等同的，文件结构是你从视觉上分离应用程序各部分的方式，而架构是从概念上分离应用程序的方式。你可以在很好地保持相同架构的同时，选择不同的文件结构方式。没有完美的文件结构，因此请根据项目的不同选择适合你的文件结构。

最后引用蚂蚁金服数据体验技术的《前端开发-领域驱动设计》文章中的总结作为结尾：

> 要明白，驱动领域层分离的目的并不是页面被复用，这一点在思想上一定要转化过来。领域层并不是因为被多个地方复用而被抽离。它被抽离的原因是：
>
> - 领域层是稳定的（页面以及与页面绑定的模块都是不稳定的）
> - 领域层是解耦的（页面是会耦合的，页面的数据会来自多个接口，多个领域）
> - 领域层具有极高复杂度，值得单独管理(view 层处理页面渲染以及页面逻辑控制，复杂度已经够高，领域层解耦可以轻 view 层。view 层尽可能轻量是我们架构师 cnfi 主推的思路)
> - 领域层以层为单位是可以被复用的（你的代码可能会抛弃某个技术体系，从 vue 转成 react，或者可能会推出一个移动版，在这些情况下，领域层这一层都是可以直接复用）
> - 为了领域模型的持续衍进(模型存在的目的是让人们聚焦，聚焦的好处是加强了前端团队对于业务的理解，思考业务的过程才能让业务前进)

下面推荐几篇相关文章：

[前端架构-让重构不那么痛苦（译）](https://juejin.im/post/5d849084e51d456206115acb)

[可扩展的前端#1--架构基础（译）](https://juejin.im/post/5d897d13f265da03c5035030)

[可扩展的前端#2--常见模式（译）](https://juejin.im/post/5d8ac00cf265da5b6a16844a)

[领域驱动设计在互联网业务开发中的实践](https://tech.meituan.com/2017/12/22/ddd-in-practice.html)

[前端开发-领域驱动设计](https://juejin.im/post/5b1c71ad6fb9a01e5918398d)

[领域驱动设计在前端中的应用](https://juejin.im/post/5d3926176fb9a07ef161c719)

## 微前端

[preload-routes](https://github.com/micro-frontends-vue/preload-routes)

[async-routes](https://github.com/micro-frontends-vue/async-routes)

### 背景介绍

对于大型前端项目，比如公司内部管理系统（一般包括 OA、HR、CRM、会议预约等系统），如果将所有业务放在一个前端项目里，随着业务功能不断增加，就会导致如下这些问题：

- 代码规模庞大，导致编译时间过长，开发、打包速度越来越慢

- 项目文件越来越多，导致查找相关文件变得越来越困难

- 某一个业务的小改动，导致整个项目的打包和部署

### 方案介绍

preload-routes 和 async-routes 是目前笔者所在团队使用的微前端方案，最终会将整个前端项目拆解成一个主项目和多个子项目，其中两者作用如下：

- 主项目：用于管理子项目的路由切换、注册子项目的路由和全局 Store 层、提供全局库和方法

- 子项目：用于开发子业务线业务代码，一个子项目对应一个子业务线，并且包含两端（PC + Mobile）代码和复用层代码（项目分层中的非视图层）

结合之前的分层架构实现复用非视图代码的方式，完整的方案如下：

<img src="https://i.loli.net/2020/02/29/Jyf3wAdbVkm5NGc.png" width=600>

如图所示，将整个前端项目按照业务线拆分出多个子项目，每个子项目都是独立的仓库，只包含了单个业务线的代码，可以进行独立开发和部署，降低了项目维护的复杂度。

采用这套方案，使得我们的前端项目不仅保有了横向上（多个子项目）的扩展性，又拥有了纵向上（单个子项目）的复用性。那么这套方案具体是怎么实现的呢？下面就详细说明方案的实现机制。

在讲解之前，首先明确下这套方案有两种实现方式，一种是预加载路由，另一种是懒加载路由，接下来就分别介绍这两种方式的实现机制。

### 实现机制

#### 预加载路由

[preload-routes](https://github.com/micro-frontends-vue/preload-routes)

1.子项目**按照 vue-cli 3 的 library 模式进行打包**，以便后续主项目引用

注：在 library 模式中，Vue 是外置的。这意味着包中不会有 Vue，即便你在代码中导入了 Vue。如果这个库会通过一个打包器使用，它将尝试通过打包器以依赖的方式加载 Vue；否则就会回退到一个全局的 Vue 变量。

2.在编译主项目的时候，**通过 InsertScriptPlugin 插件将子项目的入口文件 main.js 以 script 标签形式插入到主项目的 html 中**

注：务必将子项目的入口文件 main.js 对应的 script 标签放在主项目入口文件 app.js 的 script 标签之上，这是为了确保子项目的入口文件先于主项目的入口文件代码执行，接下来的步骤就会明白为什么这么做。

再注：本地开发环境下项目的入口文件编译后的 main.js 是保存在内存中的，所以磁盘上看不见，但是可以访问。

InsertScriptPlugin 核心代码如下：

```js
compiler.hooks.compilation.tap('InsertScriptWebpackPlugin', (compilation) => {
  compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tap(
    'InsertScriptWebpackPlugin',
    (htmlPluginData) => {
      const {
        assets: { js }
      } = htmlPluginData;
      // 将传入的 js 以 script 标签形式插入到 html 中
      // 注意：需要将子项目的入口文件 main.js 放在主项目入口文件 app.js 之前，因为需要子项目提前将自己的 route list 注册到全局上
      js.unshift(...self.files);
    }
  );
});
```

3.主项目的 html 要访问子项目里的编译后的 js / css 等资源，需要进行**代理转发**

如果是本地开发时，可以通过 webpack 提供的 proxy，例如：

```js
const PROXY = {
  '/app-a/': {
    target: 'http://localhost:10241/'
  }
};
```

如果是线上部署时，可以通过 nginx 转发或者将打包后的主项目和子项目放在一个文件夹中按照相对路径引用。

4.当浏览器解析 html 时，解析并执行到子项目的入口文件 main.js，**将子项目的 route list 注册到 Vue.\_\_share\_\_.routes 上**，以便后续主项目将其合并到总的路由中。

子项目 main.js 代码如下：（为了尽量减少首次主项目页面渲染时加载的资源，子项目的入口文件建议只做路由挂载）

```js
import Vue from 'vue';
import routes from './routes';

const share = (Vue.__share__ = Vue.__share__ || {});
const routesPool = (share.routes = share.routes || {});

// 将子项目的 route list 挂载到 Vue.__share__.routes 上，以便后续主项目将其合并到总的路由中
routesPool[process.env.VUE_APP_NAME] = routes;
```

5.继续向下解析 html，解析并执行到主项目 main.js 时，**从 Vue.\_\_share\_\_.routes 获取所有子项目的 route list，合并到总的路由表中**，然后初始化一个 vue-router 实例，并传入到 new Vue 内

相关关键代码如下

```js
// 从 Vue.__share__.routes 获取所有子项目的 route list，合并到总的路由表中
const routes = Vue.__share__.routes;

export default new Router({
  routes: Object.values(routes).reduce((acc, prev) => acc.concat(prev), [
    {
      path: '/',
      redirect: '/app-a'
    }
  ])
});
```

到此就实现了单页面应用按照业务拆分成多个子项目，直白来说子项目的入口文件 main.js 就是将主项目和子项目联系起来的桥梁。

另外如果需要使用 vuex，则和 vue-router 的顺序恰好相反（先主项目后子项目）：

1.首先在主项目的入口文件中初始化一个 store 实例 new Vuex.Store，然后挂在到 Vue.\_\_share\_\_.store 上

2.然后在子项目的 App.vue 中获取到 Vue.\_\_share\_\_.store 并调用 store.registerModule(‘app-x', store)，将子项目的 store 作为子模块注册到 store 上

#### 懒加载路由

[async-routes](https://github.com/micro-frontends-vue/async-routes)

懒加载路由，顾名思义，就是说等到用户点击要进入子项目模块，通过解析即将跳转的路由确定是哪一个子项目，然后再异步去加载该子项目的入口文件 main.js（可以通过 [systemjs](https://github.com/systemjs/systemjs) 或者自己写一个动态创建 script 标签并插入 body 的方法）。加载成功后就可以将子项目的路由动态添加到主项目总的路由里了。

1.主项目 router.js 文件中定义了**在 vue-router 的 beforeEach 钩子去拦截路由，并根据即将跳转的路由分析出需要哪个子项目，然后去异步加载对应子项目入口文件**，下面是核心代码：

```js
const cachedModules = new Set();

router.beforeEach(async (to, from, next) => {
  const [, module] = to.path.split('/');

  if (Reflect.has(modules, module)) {
    // 如果已经加载过对应子项目，则无需重复加载，直接跳转即可
    if (!cachedModules.has(module)) {
      const { default: application } = await window.System.import(
        modules[module]
      );

      if (application && application.routes) {
        // 动态添加子项目的 route-list
        router.addRoutes(application.routes);
      }

      cachedModules.add(module);
      next(to.path);
    } else {
      next();
    }
    return;
  }
});
```

2.子项目的入口文件 main.js 仅需要**将子项目的 routes 暴露给主项目**即可，代码如下：

```js
import routes from './routes';

export default {
  name: 'javascript',
  routes,
  beforeEach(from, to, next) {
    console.log('javascript:', from.path, to.path);
    next();
  }
};
```

注意：这里除了暴露 routes 方法外，另外又暴露了 beforeEach 方法，其实就是为了支持通过路由守卫对子项目进行页面权限限制，主项目拿到这个子项目的 beforeEach，可以在 vue-router 的 beforeEach 钩子执行，具体代码请参考 async-routes。

除了主项目和子项目的交互方式不同，代理转发子项目资源、vuex store 注册等和上面的预加载路由完全一致。

### 优缺点

下面谈下这套方案的优缺点：

**优点**

- 子项目可单独打包、单独部署上线，提升了开发和打包的速度

- 子项目之间开发互相独立，互不影响，可在不同仓库进行维护，减少的单个项目的规模

- 保持单页应用的体验，子项目之间切换不刷新

- 改造成本低，对现有项目侵入度较低，业务线迁移成本也较低

- 保证整体项目统一一个技术栈

**缺点**：

- 主项目和子项目需要共用一个 Vue 实例，所以无法做到某个子项目单独使用最新版 Vue（例如 Vue3）或者 React

### 部分问题解答

**1.如果子项目代码更新后，除了打包部署子项目之外，还需要打包部署主项目吗？**

不需要更新部署主项目。这里有个 trick 上文忘记提及，就是子项目打包后的入口文件并没有加上 chunkhash，直接就是 main.js（子项目其他的 js 都有 chunkhash）。也就是说主项目只需要记住子项目的名字，就可以通过 subapp-name/main.js 找到子项目的入口文件，所以子项目打包部署后，主项目并不需要更新任何东西。

**2.针对第二个问题中子项目入口文件 main.js 不使用 chunkhash 的话，如何防止该文件始终被缓存呢？**

可以在静态资源服务器端针对子项目入口文件设置强制缓存为不缓存，下面是服务器为 nginx 情况的相关配置：

```bash
location / {
    set $expires_time 7d;
    ...
    if ($request_uri ~* \/(contract|meeting|crm)-app\/main.js(\?.*)?$) {
        # 针对入口文件设置 expires_time -1，即expire是服务器时间的 -1s，始终过期
        set $expires_time -1;
    }
    expires $expires_time;
    ...
}
```

### 待完善

- 可以通过写一个脚手架来自动生成子项目以及相关的配置

### 结尾

如果没有在一个大型前端项目中使用多个技术栈的需求，还是很推荐笔者目前团队实践的这个方案的。另外如果是 React 技术栈，也是可以按照这种思想去实现类似的方案的。

## 离线包

[mobile-web-best-practice-container](https://github.com/mcuking/mobile-web-best-practice-container)

[offline-package-admin](https://github.com/mcuking/offline-package-admin)

[offline-package-webpack-plugin](https://github.com/mcuking/offline-package-webpack-plugin)

离线包技术可以将网页的网络加载时间变为 0，极大提升应用的用户体验。原理如下图所示：

<img src="https://i.loli.net/2020/02/29/KdDCoHhMUj3TmvN.png" width=600/>

我们可以先将页面需要的静态资源打包并预先加载到客户端的安装包中，当用户安装时，再将资源解压到本地存储中，当 WebView 加载某个 H5 页面时，拦截发出的所有 http 请求，查看请求的资源是否在本地存在，如果存在则直接返回资源。

### 前端部分

相关代码：

**离线包打包插件**：https://github.com/mcuking/offline-package-webpack-plugin

**应用插件的前端项目**：https://github.com/mcuking/mobile-web-best-practice

首先需要在前端打包的过程中同时生成离线包，我的思路是 webpack 插件在 emit 钩子时（生成资源并输出到目录之前），通过 compilation 对象（代表了一次单一的版本构建和生成资源）遍历读取 webpack 打包生成的资源，然后将每个资源（可通过文件类型限定遍历范围）的信息记录在一个资源映射的 json 里，具体内容如下：

资源映射 json 示例

```
{
  "packageId": "mwbp",
  "version": 1,
  "items": [
    {
      "packageId": "mwbp",
      "version": 1,
      "remoteUrl": "http://122.51.132.117/js/app.67073d65.js",
      "path": "js/app.67073d65.js",
      "mimeType": "application/javascript"
    },
    ...
  ]
}
```

其中 remoteUrl 是该资源在静态资源服务器的地址，path 则是在客户端本地的相对路径（通过拦截该资源对应的服务端请求，并根据相对路径从本地命中相关资源然后返回）。

最后将该资源映射的 json 文件和需要本地化的静态资源打包成 zip 包，以供后面的流程使用。

### 离线包管理平台

相关代码：

**离线包管理平台前后端**：https://github.com/mcuking/offline-package-admin

**文件差分工具**：https://github.com/Exoway/bsdiff-nodejs

从上面有关离线包的阐述中，有心者不难看出其中有个遗漏的问题，那就是当前端的静态资源更新后，客户端中的离线包资源如何更新？难不成要重新发一个安装包吗？那岂不是摒弃了 H5 动态化的特点了么？

而离线包平台就是为了解决这个问题。下面我以 [mobile-web-best-practice](https://github.com/mcuking/mobile-web-best-practice) 这个前端项目为例讲解整个过程：

[mobile-web-best-practice](https://github.com/mcuking/mobile-web-best-practice) 项目对应的离线包名为 main，第一个版本可以如上文所述先预置到客户端安装包里，同时将该离线包上传到离线包管理平台中，该平台除了保存离线包文件和相关信息之外，还会生成一个名为 packageIndex 的 json 文件，即记录所有相关离线包信息集合的文件，该文件主要是提供给客户端下载的。大致内容如下：

```
{
  "data": [
    {
      "module_name": "main",
      "version": 2,
      "status": 1,
      "origin_file_path": "/download/main/07eb239072934103ca64a9692fb20f83",
      "origin_file_md5": "ec624b2395a479020d02262eee36efe4",
      "patch_file_path": "/download/main/b4b8e0616e75c0cc6f34efde20fb6f36",
      "patch_file_md5": "6863cdacc8ed9550e8011d2b6fffdaba"
    }
  ],
  "errorCode": 0
}
```

其中 data 中就是所有相关离线包的信息集合，包括了离线包的版本、状态、以及文件的 url 地址和 md5 值等。

当 [mobile-web-best-practice](https://github.com/mcuking/mobile-web-best-practice) 更新后，会通过 [offline-package-webpack-plugin](https://github.com/mcuking/offline-package-webpack-plugin) 插件打包出一个新的离线包。这个时候我们就可以将这个离线包上传到管理平台，此时 packageIndex 中离线包 main 的版本就会更新成 2。

当客户端启动并请求最新的 packageIndex 文件时，发现离线包 main 的版本比本地对应离线包的版本大时，会从离线包平台下载最新的版本，并以此作为查询本地静态资源文件的资源池。

讲到这里读者可能还会有一个疑问，那就是如果前端仅仅是改动了某一处，客户端仍旧需要下载完整的新包，岂不是很浪费流量同时也延长了文件下载的时间？

针对这个问题我们可以使用一个文件差分工具 - [bsdiff-nodejs](https://github.com/Exoway/bsdiff-nodejs)，该 node 工具调用了 c 语言实现的 bsdiff 算法（基于二进制进行文件比对算出 diff/patch 包）。当上传版本为 2 的离线包到管理平台时，平台会与之前保存的版本为 1 的离线包进行 diff ，算出 1 到 2 的差分包。而客户端仅仅需要下载差分包，然后同样使用基于 bsdiff 算法的工具，和本地版本 1 的离线包进行 patch 生成版本 2 的离线包。

到此离线包管理平台大致原理就讲完了，但仍有待完善的地方，例如：

1. 增加日志功能

2. 增加离线包达到率的统计功能

...

### 客户端

相关项目：

**集成离线包库的安卓项目**：https://github.com/mcuking/mobile-web-best-practice-container

客户端的离线包库目前仅开发了 android 平台，该库是在
[webpackagekit](https://github.com/yangjianjun198/webpackagekit)（个人开发的安卓离线包库）基础上进行的二次开发，主要实现了一个多版本文件资源管理器，可以支持多个前端离线包预置到客户端中。其中拦截请求的源码如下：

```java
public class OfflineWebViewClient extends WebViewClient {
    @TargetApi(Build.VERSION_CODES.LOLLIPOP)
    @Override
    public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
        final String url = request.getUrl().toString();
        WebResourceResponse resourceResponse = getWebResourceResponse(url);
        if (resourceResponse == null) {
            return super.shouldInterceptRequest(view, request);
        }
        return resourceResponse;
    }

    /**
     * 从本地命中并返回资源
     * @param url 资源地址
     */
    private WebResourceResponse getWebResourceResponse(String url) {
        try {
            WebResourceResponse resourceResponse = PackageManager.getInstance().getResource(url);
            return resourceResponse;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
```

通过对 WebviewClient 类的 shouldInterceptRequest 方法的复写来拦截 http 请求，并从本地查找是否有相应的前端静态资源，如果有则直接返回。

### 部分问题解答

#### 1. 离线包是否可以自动更新？

当前端资源通过 CI 机自动打包后部署到静态资源服务器，那么又如何上传到离线包平台呢？我曾经考虑过当前端资源打包好时，通过接口自动上传到离线包平台。但后来发现可行性不高，因为我们的前端资源是需要经过测试阶段后，通过运维手动修改 docker 版本来更新前端资源。如果自动上传，则会出现离线包平台已经上传了了未经验证的前端资源，而静态资源服务器却没有更新的情况。因此仍需要手动上传离线包。当然读者可以根据实际情况选择合适的上传方式。

#### 2. 多 App 情况下如何区分离线包属于哪个 App？

在上传的离线包填写信息的时候，增加了 appName 字段。当请求离线包列表 json 文件时，在 query 中添加 appName 字段，离线包平台会只返回属于该 App 的离线包列表。

#### 3. 一定要在 App 启动的时候下载离线包吗？

当然可以做的更丰富些，比如可以选择在客户端连接到 Wi-Fi 的时候，或者从后台切换到前台并超过 10 分钟时候。该设置项可以放在离线包平台中进行配置，可以做成全局有效的设置或者针对不同的离线包进行个性化设置。

#### 4. 如果客户端离线包还没有下载完成，而静态资源服务器已经部署了最新的版本，那么是否会出现客户端展示的页面仍然是旧的版本呢？如果这次改动的是接口请求的变动，那岂不是还会引起接口报错？

这个大可不必担心，上面的代码中如果 http 请求没有命中任何前端资源，则会放过该请求，让它去请求远端的服务器。因此即使本地离线包资源没有及时更新，仍然可以保证页面的静态资源是最新的。也就是说有一个兜底的方案，出了问题大不了回到原来的请求服务器的加载模式。

## JSBridge

[DSBridge-IOS](https://github.com/wendux/DSBridge-IOS)

[DSBridge-Android](https://github.com/wendux/DSBridge-Android)

[WebViewJavascriptBridge](https://github.com/marcuswestin/WebViewJavascriptBridge)

混合应用中一般都是通过 webview 加载网页，而当网页要获取设备能力（例如调用摄像头、本地日历等）或者 native 需要调用网页里的方法，就需要通过 JSBridge 进行通信。

开源社区中有很多功能强大的 JSBridge，例如上面列举的库。本项目基于保持 iOS android 平台接口统一原因，采用了 DSBridge，各位可以选择适合自己项目的工具。

本项目以 h5 调用 native 提供的同步日历接口为例，演示如何在 dsbridge 基础上进行两端通信的。下面是两端的关键代码摘要：

安卓端同步日历核心代码，具体代码请查看与本项目配套的安卓项目 [mobile-web-best-practice-container](https://github.com/mcuking/mobile-web-best-practice-container)：

```java
public class JsApi {
    /**
     * 同步日历接口
     * msg 格式如下：
     * ...
     */
    @JavascriptInterface
    public void syncCalendar(Object msg, CompletionHandler<Integer> handler) {
        try {
            JSONObject obj = new JSONObject(msg.toString());
            String id = obj.getString("id");
            String title = obj.getString("title");
            String location = obj.getString("location");
            long startTime = obj.getLong("startTime");
            long endTime = obj.getLong("endTime");
            JSONArray earlyRemindTime = obj.getJSONArray("alarm");
            String res = CalendarReminderUtils.addCalendarEvent(id, title, location, startTime, endTime, earlyRemindTime);
            handler.complete(Integer.valueOf(res));
        } catch (Exception e) {
            e.printStackTrace();
            handler.complete(6005);
        }
    }
}
```

h5 端同步日历核心代码（通过装饰器来限制调用接口的平台）

```ts
class NativeMethods {
  // 同步到日历
  @limit(['android', 'ios'], '1.0.1')
  public syncCalendar(params: SyncCalendarParams, onSuccess: () => void): void {
    const cb = async (errCode: number) => {
      const msg = NATIVE_ERROR_CODE_MAP[errCode];

      Vue.prototype.$toast(msg);

      if (errCode !== 6000) {
        this.errorReport(msg, 'syncCalendar', params);
      } else {
        await onSuccess();
      }
    };

    dsbridge.call('syncCalendar', params, cb);
  }

  // 调用 native 接口出错向 sentry 发送错误信息
  private errorReport(errorMsg: string, methodName: string, params: any) {
    if (window.$sentry) {
      const errorInfo: NativeApiErrorInfo = {
        error: new Error(errorMsg),
        type: 'callNative',
        methodName,
        params: JSON.stringify(params)
      };
      window.$sentry.log(errorInfo);
    }
  }
}

/**
 * @param {platforms} - 接口限制的平台
 * @return {Function} - 装饰器
 */
function p(platforms = ['android', 'ios']) {
  return (target: AnyObject, name: string, descriptor: PropertyDescriptor) => {
    if (!platforms.includes(window.$platform)) {
      descriptor.value = () => {
        return Vue.prototype.$toast(
          `当前处在 ${window.$platform} 环境，无法调用接口哦`
        );
      };
    }

    return descriptor;
  };
}
```

另外推荐一个笔者之前写的一个基于安卓平台实现的教学版 [JSBridge](https://github.com/mcuking/JSBridge)，里面详细阐述了如何基于底层接口一步步封装一个可用的 JSBridge：

[JSBridge 实现原理](https://github.com/mcuking/JSBridge)

## 异常监控

[sentry](https://github.com/getsentry/sentry)

移动端网页相对 PC 端，主要有设备众多，网络条件各异，调试困难等特点。导致如下问题：

- 设备兼容或网络异常导致只有部分情况下才出现的 bug，测试无法全面覆盖

- 无法获取出现 bug 的用户的设备，又不能复现反馈的 bug

- 部分 bug 只出现几次，后面无法复现，不能还原事故现场

这时就非常需要一个异常监控平台，将异常实时上传到平台，并及时通知相关人员。

相关工具有 sentry，fundebug 等，其中 sentry 因为功能强大，支持多平台监控（不仅可以监控前端项目），完全开源，可以私有化部署等特点，而被广泛采纳。

下面是 sentry 在本项目应用时使用的相关配套工具。

**sentry 针对 javascript 的 sdk**

[sentry-javascript](https://github.com/getsentry/sentry-javascript)

**自动上传 sourcemap 的 webpack 插件**

[sentry-webpack-plugin](https://github.com/getsentry/sentry-webpack-plugin)

**补充：**

前端的异常主要有以下几个部分：

- 静态资源加载异常

- 接口异常（包括与后端和 native 的接口）

- js 报错

- 网页崩溃

### 静态资源加载异常

静态资源加载失败，可以通过 window.addEventListener('error', ..., true) 在事件捕获阶段获取，然后筛选出资源加载失败的错误并手动上报错误。核心代码如下：

```ts
// 全局监控资源加载错误
window.addEventListener(
  'error',
  (event) => {
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
    const url =
      (target as HTMLScriptElement | HTMLImageElement).src ||
      (target as HTMLLinkElement).href;

    this.log({
      error: new Error(`ResourceLoadError: ${url}`),
      type: 'resource load'
    });
  },
  true
);
```

### 接口异常

接口异常，可以通过在封装的 http 模块中，全局集成上报错误函数（native 接口的错误上报类似，可在项目中查看）。核心代码如下：

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

### js 报错

关于全局 js 报错，sentry 针对的前端的 sdk 已经通过 window.onerror 和 window.addEventListener('unhandledrejection', ..., false) 进行全局监听并上报。

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

#### 捕获不同域 JS 报错

针对跨域 js 问题，当加载的不同域的 js 文件时，例如通过 cdn 加载打包后的 js。如果 js 报错，window.onerror 只能捕获到 script error，没有任何有效信息能帮助我们定位问题。此时就需要我们做一些事情：
首先服务端需要在返回 js 的返回头设置 Access-Control-Allow-Origin: \*
然后设置 script 标签属性 crossorigin，代码如下：

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

### 网页崩溃

针对网页崩溃问题，推荐一个基于 service work 的监控方案，相关文章已列在下面的。如果是 webview 加载网页，也可以通过 webview 加载失败的钩子监控网页崩溃等。

[如何监控网页崩溃？](https://juejin.im/entry/5be158116fb9a049c6434f4a)

### 上传 sourcemap 到 Sentry

最后，因为部署到线上的代码一般都是经过压缩混淆的，如果没有上传 sourcemap 的话，是无法定位到具体源码的，可以现在 项目中添加 .sentryclirc 文件，其中内容可参考本项目的 .sentryclirc，然后通过 sentry-cli (需要全局全装 sentry-cli 即`npm install sentry-cli`)命令行工具进行上传，命令如下：

```
sentry-cli releases -o 机构名 -p 项目名 files 版本 upload-sourcemaps sourcemap 文件相对位置 --url-prefix js 在线上相对根目录的位置 --rewrite
// 示例
sentry-cli releases -o mcukingdom -p hello-world files 0.2.1 upload-sourcemaps dist/js --url-prefix '~/js/' --rewrite
```

当然官方也提供了 webpack 插件 [sentry-webpack-plugin](https://github.com/getsentry/sentry-webpack-plugin)，当打包时触发 webpack 的 after-emit 事件钩子（即生成资源到 output 目录之后），插件会自动上传打包目录中的 sourcemap 和关联的 js，相关配置可参考本项目的 vue.config.js 文件。

通常为了安全，是不允许在线上部署 sourcemap 文件的，所以上传 sourcemap 到 sentry 后，可手动删除线上 sourcemap 文件。

## 页面状态保持

[router-view](https://router.vuejs.org/zh/guide/essentials/nested-routes.html#%E5%B5%8C%E5%A5%97%E8%B7%AF%E7%94%B1)

[scrollBehavior](https://router.vuejs.org/zh/guide/advanced/scroll-behavior.html#%E6%BB%9A%E5%8A%A8%E8%A1%8C%E4%B8%BA)

[scrollTop](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/scrollTop)

[keep-alive](https://cn.vuejs.org/v2/guide/components-dynamic-async.html#%E5%9C%A8%E5%8A%A8%E6%80%81%E7%BB%84%E4%BB%B6%E4%B8%8A%E4%BD%BF%E7%94%A8-keep-alive)

场景描述：当从 A 页面进入 B 页面再返回时，A 页面滑动位置、条件选择、输入内容等状态均要保持。

### keep-alive

首先最先想到的可能是 vue 提供的 keep-alive，对页面实例进行缓存，返回时恢复实例即可（上面的 `页面导航管理` 部分前两个库也是基于 keep-alive 的）。如果遇到需求是：从 A 页面进入 B 页面不需要缓存 B，从 C 页面进入 B 页面需要缓存 B，那么可以将缓存的组件名保存在 vuex 上，然后在 vue-router 路由切换时，根据路由的 from 和 to 的不同来动态增删 vuex 上保存的需要缓存的组件名。具体做法可参考笔者之前写的文章 [keep-alive + vuex + vue-router 实现动态缓存 h5 页面](https://github.com/mcuking/blog/issues/41)。

### scrollBehavior

其次如果只考虑保持页面的滑动位置，可以将页面中需要记住位置的元素 scrollTop 值保存到 vuex  或 sessionStorage 中，key 可以是页面路由，或者再加上页面某个元素的标记，当返回该页面，则取出对应的 scrollTop 值，给整个页面或者其中部分元素重新设置上即可。

不过这种手动记录和恢复的方式显得过于繁琐，而 vue-router 提供的 scrollBehavior 方法，则只需在全局配置一次，即可实现记住页面位置。具体代码如下：

```js
scrollBehavior (to, from, savedPosition) {
  if (savedPosition) {
    return savedPosition
  } else {
    return { x: 0, y: 0 }
  }
}
```

但是该方式的缺陷有两点：

1. 只在支持 `history.pushState` 的浏览器中可用

2. 只能记住整体页面的位置（例如当列表仅仅是页面的一部分，则无法保持位置）

### router-view

上面提到的方式或多或少都有些缺陷，有没有更好的方式呢？

当然有，最后推荐一种比较完美的方式：`<router-view>`，即路由嵌套。通俗点说就是可以在 A 页面上再覆盖 B 页面，在 B 页面再覆盖 C 页面，而被覆盖的页面并没有销毁，类似安卓原生开发中一个 activity 覆盖另一个 ativity，从而不需要记录和恢复上一个被销毁的页面状态了。

这种方式的另一个好处是，多个页面在路由栈都是有记录的，当从 A 页面进入到 B 页面，然后触发系统返回事件时，会返回到 A 页面。相反如果使用弹出层 popup 来实现 B 页面在弹出层然后整体覆盖 A 页面，触发系统返回时，则会返回到 A 页面的上个页面，因为 B 页面在路由栈中并没有记录。

`<router-view>` 方案原理如下：

首先是在 A 页面模板中插入 `<router-view>` 标签，然后设置 B 页面为 A 页面的子路由；

然后将 `<router-view>` 设置成 fixed 定位并覆盖整个屏幕，调高 z-index；

当匹配到子路由的时候，会在 `<router-view>` 出渲染 B 页面，同时 A 页面不会销毁，而是被 B 页面完整覆盖。

## 请求数据缓存

[mem](https://github.com/sindresorhus/mem)

在我们的应用中，会存在一些很少改动的数据，而这些数据有需要从后端获取，比如公司人员、公司职位分类等，此类数据在很长一段时间时不会改变的，而每次打开页面或切换页面时，就重新向后端请求。为了能够减少不必要请求，加快页面渲染速度，可以引用 mem 缓存库。

mem 基本原理是利用闭包将函数执行结果保存在内存中，当下一次调用这个函数时，首先从内存中的缓存对象中查找是否已经存在，如果没有再执行函数。同时支持传入 maxAge，即数据的有效期，当某个数据到达有效期后，会自动销毁，避免内存泄漏。

mem 作为高阶函数，可以直接接受封装好的接口请求。但是为了更加直观简便，我们可以按照类的形式集成我们的接口函数，然后就可以用装饰器的方式使用 mem 了（装饰器只能修饰类和类的类的方法，因为普通函数会存在变量提升）。下面是相关代码：

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

export class CommonService {
  @m({ maxAge: 60 * 1000 })
  public async getQuoteList(): Promise<IQuote[]> {
    const {
      data: { list }
    } = await http({
      method: 'post',
      url: '/quote/getList',
      data: {}
    });

    return list;
  }
}
```

## 限制原生接口调用

在平时开发中可能经常遇到类似情况：如果一个新功能需要 H5 调用 Native 提供的接口，部署上线后 H5 已经更新，但用户并没有更新客户端，就会导致调用接口无效的问题。那么如何解决这个问题呢？

### 获取客户端相关信息

首先我们需要思考的是如何获取客户端的平台和版本号等信息，笔者推荐一种方式：Native 端修改 User Agent，向其中添加客户端的相关信息，而 H5 通过正则匹配到相关信息并挂在到全局上。下面是 H5 端的相关代码：

```js
// 从 UA 获取设备相关信息并在全局初始化
export const initPlatform = () => {
  const UA = navigator.userAgent;
  const info = UA.match(/\s{1}DSBRIDGE[\w\.]+$/g);
  if (info && info.length > 0) {
    const infoArray = info[0].split('_');
    window.$appVersion = infoArray[1];
    window.$systemVersion = infoArray[2];
    window.$platform = infoArray[3] as Platform;
  } else {
    window.$appVersion = '1.0.0';
    window.$systemVersion = undefined;
    window.$platform = 'browser';
  }
};
```

### 优雅的限制接口调用

然后就要思考在当前环境不满足接口调用的条件时（例如客户端版本过低、只支持 iOS 端等），如何限制接口的调用？比较直接的办法就是在调用接口的业务代码做判断，或者直接在封装的接口方法里进行判断，无论哪种都会显得冗余。这里笔者推荐使用装饰器方式对接口的方法进行装饰，如果不满足条件，则重写被装饰的方法，里面可以加些提示用户的逻辑。（前提是类的实例方法，因为装饰器只能修饰类和类的方法）。

下面就是装饰器方法的定义和使用方式:

```js
/**
 * 限制接口调用的平台和客户端版本
 * 实际情况中多个平台客户端版本不一致，可以根据项目需求对下面的函数做修改
 * @param {string} [platforms=['android', 'ios']]
 * @param {string} [version='1.0.0']
 * @returns
 */
function limit(platforms = ['android', 'ios'], version = '1.0.0') {
  return (target: AnyObject, name: string, descriptor: PropertyDescriptor) => {
    if (!platforms.includes(window.$platform)) {
      descriptor.value = () => {
        return Vue.prototype.$toast(
          `当前处在 ${window.$platform} 环境，无法调用接口哦`
        );
      };

      return descriptor;
    }

    if (
      window.$appVersion &&
      compareVersions.compare(version, window.$appVersion, '>')
    ) {
      descriptor.value = () => {
        return Vue.prototype.$toast(
          `当前客户端版本过低，请升级到 ${version} 以上版本`
        );
      };

      return descriptor;
    }
  };
}

export class NativeService implements INativeService {
  // 同步到日历
  @limit(['android', 'ios'], '1.0.1')
  public syncCalendar(params: SyncCalendarParams, onSuccess: () => void): void {
    ...
  }
}
```

## 样式适配

[postcss-px-to-viewport](https://github.com/evrone/postcss-px-to-viewport)

[Viewport Units Buggyfill](https://github.com/rodneyrehm/viewport-units-buggyfill)

[flexible](https://github.com/amfe/lib-flexible)

[postcss-pxtorem](https://github.com/cuth/postcss-pxtorem)

[Autoprefixer](https://github.com/postcss/autoprefixer)

[browserslist](https://github.com/browserslist/browserslist)

在移动端网页开发时，样式适配始终是一个绕不开的问题。对此目前主流方案有 vw 和 rem（当然还有 vw + rem 结合方案，请见下方 rem-vw-layout 仓库），其实基本原理都是相通的，就是随着屏幕宽度或字体大小成正比变化。因为原理方面的详细资料网络上已经有很多了，就不在这里赘述了。下面主要提供一些这工程方面的工具。

关于 rem，阿里无线前端团队在 15 年的时候基于 rem 推出了 flexible 方案，以及 postcss 提供的自动转换 px 到 rem 的插件 postcss-pxtorem。

关于 vw，可以使用 postcss-px-to-viewport 进行自动转换 px 到 vw。postcss-px-to-viewport 相关配置如下：

```js
"postcss-px-to-viewport": {
  viewportWidth: 375, // 视窗的宽度，对应的是我们设计稿的宽度，一般是375
  viewportHeight: 667, // 视窗的高度，根据750设备的宽度来指定，一般指定1334，也可以不配置
  unitPrecision: 3,  // 指定`px`转换为视窗单位值的小数位数（很多时候无法整除）
  viewportUnit: 'vw', // 指定需要转换成的视窗单位，建议使用vw
  selectorBlackList: ['.ignore', '.hairlines'], // 指定不转换为视窗单位的类，可以自定义，可以无限添加,建议定义一至两个通用的类名
  minPixelValue: 1, // 小于或等于`1px`不转换为视窗单位，你也可以设置为你想要的值
  mediaQuery: false // 媒体查询里的单位是否需要转换单位
}
```

下面是 vw 和 rem 的优缺点对比图：

<img src="https://i.loli.net/2020/02/29/uDBz1Ndc5iFvQtH.png" width="1200"/>

关于 vw 兼容性问题，目前在移动端 iOS 8 以上以及 Android 4.4 以上获得支持。如果有兼容更低版本需求的话，可以选择 viewport 的 pollify 方案，其中比较主流的是 [Viewport Units Buggyfill](https://github.com/rodneyrehm/viewport-units-buggyfill)。

本方案因不准备兼容低版本，所以直接选择了 vw 方案，各位可根据项目需求选择不同的方案。

另外关于设置 css 兼容不同浏览器，想必大家都知道 Autoprefixer（vue-cli3 已经默认集成了），那么如何设置要兼容的范围呢？推荐使用 browserslist，可以在 .browserslistrc 或者 pacakage.json 中 browserslist 部分设置兼容浏览器范围。因为不止 Autoprefixer，还有 Babel，postcss-preset-env 等工具都会读取 browserslist 的兼容配置，这样比较容易使 js css 兼容浏览器的范围保持一致。下面是本项目的 .browserslistrc 配置：

```js
iOS >= 10  //  即 iOS Safari
Android >= 6.0 // 即 Android WebView
last 2 versions // 每个浏览器最近的两个版本
```

最后推荐一些移动端样式适配的资料：

[rem-vw-layout](https://github.com/imwtr/rem-vw-layout)

[细说移动端 经典的 REM 布局 与 新秀 VW 布局](https://www.cnblogs.com/imwtr/p/9648233.html)

[如何在 Vue 项目中使用 vw 实现移动端适配](https://www.jianshu.com/p/1f1b23f8348f)

## 表单校验

[async-validator](https://github.com/yiminghe/async-validator)

[vee-validate](https://github.com/baianat/vee-validate)

由于大部分移动端组件库都不提供表单校验，因此需要自己封装。目前比较多的方式就是基于 async-validator 进行二次封装（elementUI 组件库提供的表单校验也是基于 async-validator ），或者使用 vee-validate（一种基于 vue 模板的轻量级校验框架）进行校验，各位可根据项目需求选择不同的方案。

本项目的表单校验方案是在 async-validator 基础上进行二次封装，代码如下，原理很简单，基本满足需求。如果还有更完善的方案，欢迎提出来。

其中 setRules 方法是将组件中设置的 rules（符合 async-validator 约定的校验规则）按照需要校验的数据的名字为 key 转化一个对象 validator，value 是 async-validator 生成的实例。validator 方法可以接收单个或多个需要校验的数据的 key，然后就会在 setRules 生成的对象 validator 中寻找 key 对应的 async-validator 实例，最后调用实例的校验方法。当然也可以不接受参数，那么就会校验所有传入的数据。

```ts
import schema from 'async-validator';
...

class ValidatorUtils {
  private data: AnyObject;
  private validators: AnyObject;

  constructor({ rules = {}, data = {}, cover = true }) {
    this.validators = {};
    this.data = data;
    this.setRules(rules, cover);
  }

  /**
   * 设置校验规则
   * @param rules async-validator 的校验规则
   * @param cover 是否替换旧规则
   */
  public setRules(rules: ValidateRules, cover: boolean) {
    if (cover) {
      this.validators = {};
    }

    Object.keys(rules).forEach((key) => {
      this.validators[key] = new schema({ [key]: rules[key] });
    });
  }

  public validate(
    dataKey?: string | string[]
  ): Promise<ValidateError[] | string | string[] | undefined> {
    // 错误数组
    const err: ValidateError[] = [];

    Object.keys(this.validators)
      .filter((key) => {
        // 若不传 dataKey 则校验全部。否则校验 dataKey 对应的数据（dataKey 可以对应一个（字符串）或多个（数组））
        return (
          !dataKey ||
          (dataKey &&
            ((_.isString(dataKey) && dataKey === key) ||
              (_.isArray(dataKey) && dataKey.includes(key))))
        );
      })
      .forEach((key) => {
        this.validators[key].validate(
          { [key]: this.data[key] },
          (error: ValidateError[]) => {
            if (error) {
              err.push(error[0]);
            }
          }
        );
      });

    if (err.length > 0) {
      return Promise.reject(err);
    } else {
      return Promise.resolve(dataKey);
    }
  }
}
```

## 手势库

[hammer.js](https://github.com/hammerjs/hammer.js)

[AlloyFinger](https://github.com/AlloyTeam/AlloyFinger)

在移动端开发中，一般都需要支持一些手势，例如拖动（Pan）,缩放（Pinch）,旋转（Rotate）,滑动（swipe）等。目前已经有很成熟的方案了，例如 hammer.js 和腾讯前端团队开发的 AlloyFinger 都很不错。本项目选择基于 hammer.js 进行二次封装成 vue 指令集，各位可根据项目需求选择不同的方案。

下面是二次封装的关键代码，其中用到了 webpack 的 require.context 函数来获取特定模块的上下文，主要用来实现自动化导入模块，比较适用于像 vue 指令这种模块较多的场景：

```ts
// 用于导入模块的上下文
export const importAll = (
  context: __WebpackModuleApi.RequireContext,
  options: ImportAllOptions = {}
): AnyObject => {
  const { useDefault = true, keyTransformFunc, filterFunc } = options;

  let keys = context.keys();

  if (isFunction(filterFunc)) {
    keys = keys.filter(filterFunc);
  }

  return keys.reduce((acc: AnyObject, curr: string) => {
    const key = isFunction(keyTransformFunc) ? keyTransformFunc(curr) : curr;
    acc[key] = useDefault ? context(curr).default : context(curr);
    return acc;
  }, {});
};

// directives 文件夹下的 index.ts
const directvieContext = require.context('./', false, /\.ts$/);
const directives = importAll(directvieContext, {
  filterFunc: (key: string) => key !== './index.ts',
  keyTransformFunc: (key: string) =>
    key.replace(/^\.\//, '').replace(/\.ts$/, '')
});

export default {
  install(vue: typeof Vue): void {
    Object.keys(directives).forEach((key) =>
      vue.directive(key, directives[key])
    );
  }
};

// touch.ts
export default {
  bind(el: HTMLElement, binding: DirectiveBinding) {
    const hammer: HammerManager = new Hammer(el);
    const touch = binding.arg as Touch;
    const listener = binding.value as HammerListener;
    const modifiers = Object.keys(binding.modifiers);

    switch (touch) {
      case Touch.Pan:
        const panEvent = detectPanEvent(modifiers);
        hammer.on(`pan${panEvent}`, listener);
        break;
      ...
    }
  }
};
```

另外推荐一篇关于 hammer.js 和一篇关于 require.context 的文章：

[H5 案例分享：JS 手势框架 —— Hammer.js](https://www.h5anli.com/articles/201609/hammerjs.html)

[使用 require.context 实现前端工程自动化](https://www.jianshu.com/p/c894ea00dfec)

## Webpack 策略

### 基础库抽离

对于一些基础库，例如 vue、moment 等，属于不经常变化的静态依赖，一般需要抽离出来以提升每次构建的效率。目前主流方案有两种：

一种是使用 [webpack-dll-plugin](https://webpack.docschina.org/plugins/dll-plugin/) 插件，在首次构建时就讲这些静态依赖单独打包，后续只需引入早已打包好的静态依赖包即可；

另一种就是外部扩展 [Externals](https://webpack.docschina.org/configuration/externals/) 方式，即把不需要打包的静态资源从构建中剔除，使用 CDN 方式引入。下面是 webpack-dll-plugin 相对 Externals 的缺点：

1. 需要配置在每次构建时都不参与编译的静态依赖，并在首次构建时为它们预编译出一份 JS 文件（后文将称其为 lib 文件），每次更新依赖需要手动进行维护，一旦增删依赖或者变更资源版本忘记更新，就会出现 Error 或者版本错误。

2. 无法接入浏览器的新特性 script type="module"，对于某些依赖库提供的原生 ES Modules 的引入方式（比如 vue 的新版引入方式）无法得到支持，没法更好地适配高版本浏览器提供的优良特性以实现更好地性能优化。

3. 将所有资源预编译成一份文件，并将这份文件显式注入项目构建的 HTML 模板中，这样的做法，在 HTTP1 时代是被推崇的，因为那样能减少资源的请求数量，但在 HTTP2 时代如果拆成多个 CDN Link，就能够更充分地利用 HTTP2 的多路复用特性。

不过选择 Externals 还是需要一个靠谱的 CDN 服务的。

本项目选择的是 Externals，各位可根据项目需求选择不同的方案。

更多内容请查看这篇文章（上面观点来自于这篇文章）：

[Webpack 优化——将你的构建效率提速翻倍](https://juejin.im/post/5d614dc96fb9a06ae3726b3e)

## 调试控制台

[eruda](https://github.com/liriliri/eruda)

[vconsole](https://github.com/Tencent/vConsole)

在调试方面，本项目使用 eruda 作为手机端调试面板，功能相当于打开 PC 控制台，可以很方便地查看 console, network, cookie, localStorage 等关键调试信息。与之类似地工具还有微信的前端研发团队开发的 vconsole，各位可以选择适合自己项目的工具。

关于 eruda 使用，推荐使用 cdn 方式加载，至于什么时候加载 eruda，可以根据不同项目制定不同策略。示例代码如下：

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

虽然有了 eruda 调试工具，但某些情况下仍不能满足需求，比如现网完全关闭 eruda 等情况。

此时就需要抓包工具，相关工具主要就是上面罗列的这两个，各位可以选择适合自己项目的工具。

通过 charles 可以清晰的查看所有请求的信息(注：https 下抓包需要在手机上配置相关证书)。当然 charles 还有更多强大功能，比例模拟弱网情况，资源映射等。

推荐一篇不错的 charles 使用教程：

[解锁 Charles 的姿势](https://juejin.im/post/5a1033d2f265da431f4aa81f)

## 部署

[Jenkins](https://jenkins.io/zh/)

[Docker](https://www.docker.com/)

Jenkins 和 Docker 相关官网如上，具体用途就不再这里赘述了，如果想了解相关知识，也可以阅读本模块结尾处推荐的几篇文章。

笔者以 CentOS 7.6 系统为基础，介绍如何使用 Github + Jenkins + Docker 实现项目的自动化打包部署。

### Docker 安装

**1.安装 Docker 并启动 Docker**

```
// 更新软件库
yum update -y

// 安装 docker
yum install docker -y

// 启动 docker 服务
service docker start

// 重启docker 服务
service docker restart

// 停止 docker 服务
service docker stop
```

**2.安装 Docker-Compose 插件用于编排镜像**

```
// 下载并安装 docker-compose (当前最新版本为 1.24.1，读者可以根据实际情况修改最新版本)
curl -L https://github.com/docker/compose/releases/download/1.24.1/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose

// 设置权限
chmod +x /usr/local/bin/docker-compose

// 安装完查看版本
docker-compose -version
```

### Jenkins 安装和配置

**1.搜索 Jenkins**

```
docker search jenkins
```

![image](https://user-images.githubusercontent.com/22924912/68565589-f6c20900-048e-11ea-97b8-968542236015.png)

**注意**：虽然上图中第一个是 Docker 官方维护的版本，但它很长时间没有更新了，是一个过时的版本。所以这里我们要安装第二个，这个是 Jenkins 官方维护的。

**2.安装 Jenkins**

```
sudo docker run -d -u 0 --privileged --name jenkins -p 49003:8080 -v /root/jenkins_home:/var/jenkins_home jenkins/jenkins:latest
```

其中:
-d 指的是在后台运行；
-u 0 指的是传入 root 账号 ID，覆盖容器中内置的账号；
-v /root/jenkins_home:/var/jenkins_home 指的是将 docker 容器内的目录 /var/jenkins_home 映射到宿主机 /root/jenkins_home 目录上；
--name jenkins 指的是将 docker 容器内的目录 /var/jenkins_home 映射到宿主机 /root/jenkins_home 目录上；
-p 49003:8080 指的是将容器的 8080 端口映射到宿主机的 49003 端口；
--privileged 指的是赋予最高权限。

整条命令的意思就是：
运行一个镜像为 jenkins/jenkins:latest 的容器，命名为 jenkins_home，使用 root 账号覆盖容器中的账号，赋予最高权限，将容器的 /var/jenkins_home 映射到宿主机的 /root/jenkins_home 目录下，映射容器中 8080 端口到宿主机 49003 端口

执行完成后，等待几十秒，等待 Jenkins 容器启动初始化。到浏览器中输入 `http://your ip:49003` 查看 Jenkins 是否启动成功

看到如下界面说明启动成功：

![image](https://user-images.githubusercontent.com/22924912/68573362-8a510500-04a2-11ea-9f42-1f8a85812788.png)

通过如下命令获取密码，复制到上图输入框中

```
cat /root/jenkins_home/secrets/initialAdminPassword
```

进入到下个页面，选择【安装推荐的插件】。

由于墙的问题，需要修改 Jenkins 的默认下载地址。可以在浏览器另起一个 tab 页面，进入 `http://your ip:49003/pluginManager/advanced`，修改最下面的升级站点 URL 为 `http://mirror.esuni.jp/jenkins/updates/update-center.json`

![image](https://user-images.githubusercontent.com/22924912/68567715-aa79c780-0494-11ea-9b03-4311bd083470.png)

然后重启容器，再次进入初始化页面，通常下载速度会加快。

```
docker restart [docker container id]
```

然后就是创建管理员账号。

进入首页后，因为自动化部署中需要通过 ssh 登陆服务器执行命令以及 node 环境，所以需要下载 Publish Over SSH 和 NodeJS 插件，可通过系统管理 -> 管理插件 -> 可选插件进入，搜索选中并直接安装。如下图所示：

![image](https://user-images.githubusercontent.com/22924912/68568520-c41c0e80-0496-11ea-9f18-6e3d62687ee1.png)

需要注意的是，Publish Over SSH 需要配置相关 ssh 服务器，通过系统管理 -> 系统设置 进入并拉到最下面，输入 Name、Hostname、Username、Passphrase / Password 等参数。如下图所示：

![image](https://user-images.githubusercontent.com/22924912/68636791-af438780-0537-11ea-9ab8-2130d6affd8a.png)

然后点击 Test Configuration 校验能否登陆。

至此 Jenkins 已经完成了全局配置。

### 关联 Jenkins 和 Github

在 GitHub 创建一个项目，以本项目为例，在项目根目录下创建 nginx.conf 和 docker-compose.yml 文件

nginx.conf

```nginx
#user nobody;
worker_processes 1;
events {
  worker_connections 1024;
}
http {
  include    mime.types;
  default_type application/octet-stream;
  sendfile    on;
  #tcp_nopush   on;
  #keepalive_timeout 0;
  keepalive_timeout 65;
  #gzip on;
  gzip on;
  gzip_min_length 5k;
  gzip_buffers   4 16k;
  #gzip_http_version 1.0;
  gzip_comp_level 3;
  gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png;
  gzip_vary on;

  server {
    listen 80;
    server_name localhost;
    #前端项目
    location / {
        index index.html index.htm;  #添加属性。 
        root /usr/share/nginx/html/dist;  #站点目录
        # 所有静态资源均指向 /index.html
        try_files $uri $uri/ /index.html;
    }

    error_page  500 502 503 504 /50x.html;
    location = /50x.html {
      root  /usr/share/nginx/html/dist;
    }
  }
}
```

docker-compose.yml

```yml
version: '3'
services:
  mobile-web-best-practice: #项目的 service name
    container_name: 'mobile-web-best-practice-container' #容器名称
    image: nginx #指定镜像
    restart: always
    ports:
      - 8001:80
    volumes:
      #~ 将宿主机上的本项目的 nginx.conf 文件映射到容器内的 /etc/nginx 文件
      - ./nginx.conf:/etc/nginx/nginx.conf #挂载 nginx 配置
      #~ 将宿主机上的本项目映射到容器的 /usr/share/nginx/html
      - ./:/usr/share/nginx/html/ #挂载项目
    privileged: true
```

这里需要解释下 volumes 参数，在打包 Docker 镜像时，如果将 nginx.conf 和 dist 直接拷贝到镜像中，那么每次修改相关文件时，都需要重新打包新的镜像。通过 volumes 可以将宿主机的某个文件映射到容器的某个文件，那么改动相关文件，就不要重新打包镜像了，只需修改宿主机上的文件即可。

> PS：如果直接将 dist 目录映射到容器中，则每次构建后删除并重新生成 dist 目录时，会产生文件访问权限问题。为了解决该问题，将目录向上提升一级，即整体项目映射到容器中（整体项目不会存在删除并重新生成的问题）。同时需要修改 `nginx.conf` 的配置，将 root 设置为 `/usr/share/nginx/html` 下的 dist 目录。

然后在 Jenkins 创建一个新的任务，选择【构建一个自由风格的软件项目】，并设置相关配置，如下图所示。

![image](https://user-images.githubusercontent.com/22924912/68570157-edd73480-049a-11ea-9c82-c1c98c493208.png)

![image](https://user-images.githubusercontent.com/22924912/68570189-00516e00-049b-11ea-99db-3e67e2dd000f.png)

![image](https://user-images.githubusercontent.com/22924912/68573211-3a723e00-04a2-11ea-85ec-4aa3a17100f1.png)

其中第三张图两部分命令含义如下：

第一部分 shell 命令是 build 前端项目，会在项目根目录下生成 dist 目录

```
echo $PATH
node -v
npm -v
npm install
npm run build
```

第二部分 shell 命令就是通过 ssh 登陆服务器，通过 docker-compose 进行构建 docker 镜像并运行容器。相较于直接使用 docker ，当更新代码时无需执行停止删除容器，重新构建新的镜像等操作。

```
cd /root/jenkins_home/workspace/mobile-web-best-practice \
&& docker-compose up -d
```

最后可以回到该任务页，点击【立即构建】来构建我们的项目了。

### 实现自动触发打包

不过仍有个问题，那就是当向 GitHub 远程仓库 push 代码时，需要能够自动触发构建，相关操作如下。

**1.修改 Jenkins 安全策略**

通过系统管理 -> 全局安全配置 进入，并如下图操作

![image](https://user-images.githubusercontent.com/22924912/68571182-65a65e80-049d-11ea-80e8-fc63733941f8.png)

**2.生成 Jenkins API Token**

通过用户列表 -> 点击管理员用户 -> 设置，点击添加新 token，然后复制身份验证令牌 token

![image](https://user-images.githubusercontent.com/22924912/68571430-f11fef80-049d-11ea-8b42-2d51528981ea.png)

**3.在 Jenkins 项目对应任务的设置中配置【构建触发器】，将刚复制的 token 粘贴进去，如下图所示：**

![image](https://user-images.githubusercontent.com/22924912/68571656-760b0900-049e-11ea-8d42-94ed69d0a629.png)

**4.在 Github 相关项目中打开 Setting -> Webhooks -> Add webhooks，输入格式如下的 URL :**

```
// 前面是 Jenkins 服务地址，mobile-web-best-practice 指在 Jenkins 的任务名称，Token指上面获取的令牌
http://12x.xxx.xxx.xxx:xxxx/job/mobile-web-best-practice/build?token=Token
```

![image](https://user-images.githubusercontent.com/22924912/68571806-d69a4600-049e-11ea-8681-143e5282f81c.png)

这样，我们就实现了在 push 新的代码后，自动触发 Jenkins 打包项目代码，并打包 docker 镜像然后创建容器运行。

最后推荐几篇相关文章：

[写给前端的 Docker 实战教程](https://juejin.im/post/5d8440ebe51d4561eb0b2751)

[[手把手系列之]Docker 部署 vue 项目](https://juejin.im/post/5cce4b1cf265da0373719819)

[[手把手系列之] Jenkins+Docker 自动化部署 vue 项目](https://juejin.im/post/5db9474bf265da4d1206777e)

[从零搭建 docker+jenkins+node.js 自动化部署环境](https://juejin.im/post/5b8ddb70e51d45389153f288)

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
    if (!ele) return;
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
