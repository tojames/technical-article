# Webpack

### webpack是什么?

可以看做一个模块化打包机，分析项目结构，处理模块化依赖，转换成为浏览器可运行的代码。

- 代码转换: TypeScript 编译成 JavaScript、SCSS,LESS 编译成 CSS.
- 文件优化：压缩 JavaScript、CSS、HTML 代码，压缩合并图片。
- 代码分割：提取多个页面的公共代码、提取首屏不需要执行部分的代码让其异步加载。
- 模块合并：在采用模块化的项目里会有很多个模块和文件，需要构建功能把模块分类合并成一个文件。
- 自动刷新：监听本地源代码的变化，自动重新构建、刷新浏览器。

构建把一系列前端代码自动化去处理复杂的流程，解放生产力。

安装 `npm install webpack webpack-cli -D`

### loader

```
webpack只能处理JavaScript的模块，如果要处理其他类别的文件，需要使用loader进行转换，它是指用来将一段代码转换成另一段代码的webpack转换器，如sass转换为css，并且转换为 commonJS 规范的文件后才能被webpack处理。

多个loader的执行顺序是 右到左「数组」，从下到上执行「对象」，可以设置 pre normal post

语法转换
babel-loader 使用 Babel 加载 ES2015+ 代码并将其转换为 ES5
ts-loader 像加载 JavaScript 一样加载 TypeScript 2.0+
模板 
html-loader 将 HTML 导出为字符串，需要传入静态资源的引用路径
样式
style-loader 将模块导出的内容作为样式并添加到 DOM 中
css-loader 加载 CSS 文件并解析 import 的 CSS 文件，最终返回 CSS 代码
less-loader 加载并编译 LESS 文件
sass-loader 加载并编译 SASS/SCSS 文件
postcss-loader 使用 PostCSS 加载并转换 CSS/SSS 文件
stylus-loader 加载并编译 Stylus 文件
Linting 
eslint-loader 使用 ESLint 对代码进行格式化
框架 
vue-loader 加载并编译 Vue 组件

手写loader
其实loader做一个转换，把ast获取到的源码进行加工，再返回源码。
```



### plugins

```
plugin 是一个扩展器，它丰富了 webpack 本身，针对是 loader 结束后，webpack 打包的整个过程，它并不直接操作文件，基于事件流框架 Tapable 机制工作，会监听 webpack 打包过程中的某些节点，执行广泛的任务，插件执行是不分顺序的。

webpack-bundle-analyzer 分析打包后的文件大小
webpackbar 项目执行命令时的进度条
compression-webpack-plugin gzip压缩
ignore-plugin 忽略一下文件的打包，比如moment的语言包 
provide-plugin 全局变量注入
clean-webpack-plugin: 目录清理
html-webpack-plugin 配置html，配置单页面或者多页面

手写plugins
plugin都有一个apply方法，然后通过这个方法接受了complier，它里面有很多的钩子函数，我们可以利用里面的钩子函数去做一些事情，那这些钩子函数都是继承在tapable，大概思路就是这样。

tapable
	1、Sync*「同步」
				1.1、SyncHook 普通的发布订阅模式
				1.2、SyncBailHook 返回undefined即可继续往下，返回true则中断，保险Hook，react中也有应用到此思想，比如生命周期，是否需要更新。
				1.3、SyncWaterfallHook 使用 Array.reduce 累加就可以将上一个函数执行完的返回值，返回给下一个函数
				1.4、SyncLoopHook 只要循环返回undefined才走下一个，不然会一直循环
	2、Async*「异步」
				2.1、AsyncParallel*「并行」
							AsyncParallelHook 
							AsyncParallelBailHook
				2.2、AsyncSeries* 「串行」
							AsyncSeriesHook
							AsyncSeriesBailHook
							AsyncSeriesWaterfallHook
		
	
```



#### webpack有哪些可以优化的

```
1）noParse 将一些已经打包过的文件，不去解析，可以增加项目的打包速度
2）使用DllReferencePlugin 用某种方法实现了拆分 bundles，同时还大幅度提升了构建的速度。
3）happypack 多进程打包，有时候项目小显得鸡肋，webpack5 废弃
4）commonChunkPlugins，抽离公共代码
5）懒加载 import
6）热更新 hmr

思路：可以减少webpack的工作，减少查找范围都是可以考虑的。
```



#### Webpack构建流程简单说一下|| 模块打包原理知道吗

```
webpack本质上是一种事件流的机制，它的工作流程就是将各个插件串联起来，而实现这一切的核心就是Tapable，核心原理也是依赖于发布订阅模式。

入口是webpack.js
实例化Compiler类，把config参数传进去，并且运行实例run
进入到Compiler.js
Compiler继承Tapable，有大量的Tapable hook赋值在当前Compiler的hook身上
里面有大量的方法，它的主要作用是 
构建模块：通过 key ：code，这种形式返回出去， key是当前的项目相对路径，code 就是通过ast解析后返回的代码，这里会把loader和plugin中的配置也需要执行一边。
发射文件：生成config配置出口参数的文件。

```



#### sourcemap是什么？

```
生产环境中的源码都是经过压缩的，出现报错就没法监控了，sourcemap是源码映射，有以下选项可以配置
1）devtool："source-map", // 会单独生成一个sourcemap文件，出错了，会标识当前报错的列和行，大和全。
2）devtool: "eval-source-map", // 不会产生单独的文件，集成在打包文件中，但是可以显示行和列
3）devtool: "cheap-module-source-map", // 不会显示列，但是是一个单独的映射文件，用得不多。
3）devtool: "cheap-module-eval-source-map" // 不会生成文件，集成在打包文件中，显示行，不显示列

```



#### 文件监听原理呢？

```
在发现源码发生变化时，自动重新构建出新的输出文件。

Webpack开启监听模式，有两种方式：
 启动 webpack 命令时，带上 --watch 参数
 在配置 webpack.config.js 中设置 watch:true
 开启之后我们还可以配置一些参数
 watchOptions:{
 		poll:1000, // 每秒询问 1000 次
 		aggregateTime:500, // 防抖 输入完代码后才触发
 		ignored:/node_module/ // 忽略不需要监控的文件
 }
解决问题是：不需要我们重新打包，
缺点：每次需要手动刷新浏览器

原理：轮询判断文件的最后编辑时间是否变化，如果某个文件发生了变化，并不会立刻告诉监听者，而是先缓存起来，等 aggregateTimeout 后再执行。
```



####  Webpack 的热更新原理

![HMR流程图](../imgs/HMR流程图.jpg)

```
https://zhuanlan.zhihu.com/p/30669007
https://zhuanlan.zhihu.com/p/30623057
开启需要在 devServe.hot = true
在plugin中配置 new webpack.HotModuleReplacementPlugin() // 热更新模块
new webpack.NameModulePlugin() // 打印更新的模块路径

来自一位饿了么的大佬的文章
上图底部红色框内是服务端，而上面的橙色框是浏览器端。
绿色的方框是 webpack 代码控制的区域。蓝色方框是 webpack-dev-server 代码控制的区域，洋红色的方框是文件系统，文件修改后的变化就发生在这，而青色的方框是应用本身。
上图显示了我们修改代码到模块热更新完成的一个周期，通过深绿色的阿拉伯数字符号已经将 HMR 的整个过程标识了出来。

第一步，在 webpack 的 watch 模式下，文件系统中某一个文件发生修改，webpack 监听到文件变化，根据配置文件对模块重新编译打包，并将打包后的代码通过简单的 JavaScript 对象保存在内存中。
第二步是 webpack-dev-server 和 webpack 之间的接口交互，而在这一步，主要是 dev-server 的中间件 webpack-dev-middleware 和 webpack 之间的交互，webpack-dev-middleware 调用 webpack 暴露的 API对代码变化进行监控，并且告诉 webpack，将代码打包到内存中。
第三步是 webpack-dev-server 对文件变化的一个监控，这一步不同于第一步，并不是监控代码变化重新打包。当我们在配置文件中配置了devServer.watchContentBase 为 true 的时候，Server 会监听这些配置文件夹中静态文件的变化，变化后会通知浏览器端对应用进行 live reload。注意，这儿是浏览器刷新，和 HMR 是两个概念。
第四步也是 webpack-dev-server 代码的工作，该步骤主要是通过 sockjs（webpack-dev-server 的依赖）在浏览器端和服务端之间建立一个 websocket 长连接，将 webpack 编译打包的各个阶段的状态信息告知浏览器端，同时也包括第三步中 Server 监听静态文件变化的信息。浏览器端根据这些 socket 消息进行不同的操作。当然服务端传递的最主要信息还是新模块的 hash 值，后面的步骤根据这一 hash 值来进行模块热替换。
webpack-dev-server/client 端并不能够请求更新的代码，也不会执行热更模块操作，而把这些工作又交回给了 webpack，webpack/hot/dev-server 的工作就是根据 webpack-dev-server/client 传给它的信息以及 dev-server 的配置决定是刷新浏览器呢还是进行模块热更新。当然如果仅仅是刷新浏览器，也就没有后面那些步骤了。
HotModuleReplacement.runtime 是客户端 HMR 的中枢，它接收到上一步传递给他的新模块的 hash 值，它通过 JsonpMainTemplate.runtime 向 server 端发送 Ajax 请求，服务端返回一个 json，该 json 包含了所有要更新的模块的 hash 值，获取到更新列表后，该模块再次通过 jsonp 请求，获取到最新的模块代码。这就是上图中 7、8、9 步骤。
而第 10 步是决定 HMR 成功与否的关键步骤，在该步骤中，HotModulePlugin 将会对新旧模块进行对比，决定是否更新模块，在决定更新模块后，检查模块之间的依赖关系，更新模块的同时更新模块间的依赖引用。
最后一步，当 HMR 失败后，回退到 live reload 操作，也就是进行浏览器刷新来获取最新打包代码。
```



#### 代码分割

```
入口起点：使用 entry 配置手动地分离代码。
防止重复：使用 Entry dependencies 或者 SplitChunksPlugin 去重和分离 chunk。
动态导入：通过模块的内联函数调用来分离代码。import

```



