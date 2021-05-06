Redux实战（书籍示例代码）：https://github.com/wfro/parsnip.git
Redux术语表：https://github.com/reactjs/redux/blob/master/docs/Glossary.md

扩展知识：
1、-P标记是--save-prod的别名。
```js
    npm install -PRedux === npm install --save-prod Redux
```
2、redux的createStore函数最多可以接收三个参数：reducer、初始state、增强器。当只传递两个参数时，redux默认假定第二个参数是增强器，而没有初始state。


一、redux将状态管理职责划分成三个独立的单元：
1、store将应用程序的所有状态都存储在单个对象中（通常将此对象称为对象树）；
2、只能使用action更新store，action是描述时间的对象；
3、reducer函数指定了如何转换应用程序的状态，reducer是函数，它接收store中的当前状态和一个action，然后返回更新后的下一个状态。


二、react和redux是使用绑定进行连接的，这个绑定就是react-redux。


三、redux的三个原则：单一数据源、state是只读的、state的改变只能由纯函数进行。


四、react-redux是component的增强剂，它提供的两个工具将redux和react连接在一起。
```js
    1、Provider：在react程序顶层渲染的react组件，provider的任何子组件都有权限访问redux store；
    <Provider store={ store }></Provider>

    2、connect：一个将react和redux store的数据进行桥接的函数。
    只要使用了connect包裹组件，不管connect函数有没有传递参数，被包裹的组件的props中都会有dispatch方法。
    mapStateToProps方法中的state表示redux store中全部数据，这个方法只负责将组件需要的相关数据传到props中。
```


五、展示组件和容器组件
1、展示组件负责：接收给定的相同数据，将始终获得相同的渲染输出。

2、容器组件负责：
1）通过connect从redux store获取数据；
2）使用mapStateToProps只传递相关的数据到连接的组件；
3）渲染展示组件。

注意：将组件分为容器组件和展示组件是一种约定，而不是react和redux的硬性规定。（本意是将组件的表现和行为分开）

副作用：就是任何对外部世界有显著影响的代码。


六、调试Redux应用程序
1、在Chrome浏览器中启用Redux DevTools，包含两个步骤：
1）安装Redux DevTools扩展程序：在Chrome网上商店搜索Redux DevTools扩展程序，然后安装；Chrome浏览器安装了Redux DeTools调试工具后，Chrome DevTools内会添加一个Redux的新面板。

2）将Redux DevTools连接至store：
```js
    // 下载依赖包，并放在开发环境中（因为Redux DevTools是用来协助开发的）。
    npm install -D redux-devtools-extension

    // 从redux-devtools-extension导入devToolsEnhancer函数并将其传给store。
    import { createStore, applyMidderware } from 'redux';
    import { devToolsEnhancer } from 'redux-devTools-extension';
    const store = createStore(reducer, applyMidderware(devToolsEnhancer));
```

2、Webpack模块热替，它能使应用程序更新任何组件而无需刷新页面（react脚手架默认会启用此功能），webpack不会在生产环境暴露module.hot对象，因为它只是一种用于加速开发过程的工具。
```js
    // 原理：Webpack在开发模式下会暴露module.hot对象，该对象提供了accept方法，accept方法接收两个参数：一个或多个依赖，以及一个回调函数（该回调函数在模块成功替换后会执行）。如果需要任何组件的更新都触发热替换，只需要把顶层组件当作依赖即可，因为顶级组件的子级更新时，父级都会发生变更。
    if(module.hot){
        // 1、热加载组件
        module.hot.accept("./App",()=>{
            // 每当App及其子组件发生变更时，都会重新渲染组件。
            const NextApp = require("./App").default;
            ReactDOM.render(<Provider store={store}><NextApp /></Provider>, document.getElementById('root'));
        })
    }

    // 总结：对组件的每一次更新都会导致模块被替换，并且在不重新加载页面的情况下将这些变更渲染至DOM。
```

3、Webpack模块热替换，使用更新的reducer替换旧的reducer并重新计算状态。
```js
    if(module.hot){
        // 应用场景：在为某个action开发工作流程时，在reducer中拼错了单词，但是测试编写的代码时，已经创建了任务，甚至在Redux DevTools里也看到了产生的日志，但用户界面没有出现任何变更，此时通过模块热替换作用于reducer，纠正拼写错误后，用户界面将会立即出现丢失的任务，而无需更新页面。）
        module.hot.accept("./reducers",()=>{
            const nextRootReducer = require("./reducers").default;
            store.replaceReducer(nextRootReducer);
        })
    }
```

注意：
1、模块热替换是一种仅用于开发以加速开发过程的工具。
2、局限性：
1）更新非组件文件可能需要刷新整个页面，并且控制台也会输出相关警告；
2）无法在React组件中维持局部组件状态
使用React Hot Loader可以解决模块热替换后维持局部状态，因为React Hot Loader和Create React App不兼容，需要配置Babel或Webpack。更多指南信息，参考React Hot Loader的Github仓库，https://github.com/gaearon/react-hot-loader。
添加React Hot Loader的价值取决于应用程序中局部组件状态的大小和复杂程度，局部组件状态越大，越复杂，React Hot Loader的价值越高。


七、redux-thunk
redux-thunk中间件让dispatch可以派发函数，如果不使用redux-thunk，直接往dispatch中派发函数，则redux会报错，因为redux期忘向dispatch传递对象。


【Redux-Saga专题】
一、Redux-Saga介绍
1、中间件概念：
简单的说，就是一种独立运行于各个框架之间的代码，本质是一个函数，可访问请求对象和响应对象，可对请求进行拦截处理，处理后再将控制权向下传递，也可中止请求，向客户端做出响应。
而在Redux里面，就借鉴了这一思想，中间件是运行在action发送出去，到达reducer之间的一段代码，这样就可以把代码调用流程变为 action -> Middlewares -> reducer，这种机制可以让我们改变数据流，实现例如异步action、action过滤、日志输入、异常报告等功能。
```js
    import { applyMiddleware } from 'redux';
    applyMiddleware方法可以应用多个中间件。
```

中间件就是在reducer返回state到store之间的时候，截获state进行操作。

2、Redux-Saga
1）redux-saga是一个用于管理应用程序 Side Effect 副作用（例如：异步操作等）的library，它的目的是让副作用管理更加的简单，执行更加高效.
2）redux-saga就是redux的一个中间件，可以通过正常的redux action从主应用程序启动、暂停、取消，它可以访问完整的redux store，也能够dispatch redux action
3）redux-saga使用了ES6的Generator功能，让异步流程更加易于读取、写入、测试，通过这种方式，让异步看启来更加像标准同步的javascript代码（有点类似async/await）


二、Redux-Saga常见的API
1、Middleware API
1）通过createSagaMiddleware(option)，创建一个Redux Middleware，并将Sagas连接到Redux Store（通过createStore第三个参数传入）。option是传递给middleware的选项列表，默认可以不用传递。
2）通过middleware.run(saga, ...args)动态地运行saga。
注意：middleware.run()只能在applyMiddleware阶段之后执行Saga。

2、saga辅助函数
这三个辅助函数都是用来监听action的，只要dispatch了action，就会触发对应辅助函数的generator（saga）函数的调用。
```js
    import { takeEvery, takeLatest, throttle } from 'redux-saga/effects';

    export function* defSaga() {
        // 1）takeEvery(pattern, saga, ...args)，每一次触发事件产生的dispatch_action，只要匹配takeEvery中的pattern，就会触发takeEvery的saga函数（generator函数），并执行里面的yield内容；也就是触发多少个takeEvery，就会执行多少次takeEvery里面的内容。
        yield takeEvery("takeEvery", function* (){
            console.log("takeEvery");
        });
        // 备：

        // 2）takeLatest(pattern, saga, ...args)，触发事件产生的dispatch_action，只要匹配takeLatest中的pattern，就会触发takeLatest的saga函数（generator函数），并执行里面的yield内容，在执行本次saga时，如果上次及之前的saga启动了但仍在执行中，则上次及之前的saga会被自动取消执行。也就是只有最后一次触发的takeLatest生效。
        yield takeLatest("takeLatest", function* (){
            console.log("takeLatest");
        })

        // 3）throttle(ms, pattern, saga, ...args)，在发起dispatch到store，并且匹配pattern的每一个action上派生一个saga。它在派生一次任务之后，仍然将新传入的action接收在底层的buffer中，至多保留（就是第一个执行的action的下一个action）一个。与此同时，它在ms毫秒内将暂停派生新的任务，这也是它被命名为节流阀（throttle）的原因。
        yield throttle(0, "throttle", function* (){
            console.log("throttle");
        })
    }
```

3、effect创建器
```js
    yield takeEvery("takeEvery", function* (){
        // 1）select(selector, ...args)，selectorh是一个回调函数，回调函数的参数是对应action.type处理后的state，可以在回调函数内处理好state返回希望的值。释义：获取redux中的state，如果调用的select的参数为空（即yield select()）,那么effect会取得完整的state（与调用getState()的结果相同）
        // 获取state里面指定的数据
        const user = yield select(state => state.user);
        

        // 2）call(fn, ...args)，创建一个effect描述信息，用来命令middleware以参数args调用函数fn。其实就是调用异步请求，传入对应的参数。
        const res = yield call(axios.post, " http://localhost:3000/user", {
            ...user
        })


        // 3）take(pattern)，阻塞代码往下执行，只有匹配的action发出了，才能继续往下执行。
        yield take("take");

        yield takeLatest("takeLatest", function* (){
            console.log("takeLatest");
        })


        // 4）put(action)，用来命令middleware向Store发起一个action，这个effect是非阻塞型的。派发了action之后，就可以在reducers那里处理对应action的state了。
        yield put({ type: "login_success", ...res.data })
    });
```

4、effect组合器
```js
    import listSaga from './listSaga';
    import loginSaga from './listSaga';

    // 1）all([...effects])，创建一个effect描述信息，用来命令middleware并行地运行多个effect，并等待它们全部完成。
    export default function* defsagas(){
        yield all([listSaga(), loginSaga()]);
    }
```