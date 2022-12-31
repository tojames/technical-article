# splitChunks

当项目代码变大、变多依赖复杂，如果简单打包。

- 会出现重复打包，最后导致 `dist` 文件偏大，**文件大小需要优化**
- 重复打包后，文件重复引入，**http请求数需要优化**
- 文件打包后过大，过小，**过大：文件大小需要优化，过小：http请求数需要优化**

**解决问题：提取公共代码，防止代码被重复打包，拆分过大的 javascript 文件，合并零散的 javascript 文件**，并且拆分完后合理利用缓存策略是有利于项目的加载速度的。

从工程化角度思考，应该让打包工具去做，比如 Vite、Webpack、Glup、Rollup。

以 webpack 为例，从 `webpack4.0` 开始 `SplitChunksPlugin` 替代了 `CommonsChunkPlugin`，集成在 `webpack ` 中。通过配置webpack，让 SplitChunks 帮开发者解决这样的问题。



https://webpack.js.org/plugins/split-chunks-plugin/



## 使用和配置

集成在 `webpack ` 中，直接在 optimization.splitChunks 中配置即可，以下参数为默认值，官方：fit web performance best practices，但是每个项目肯定有所不同，以下将会解析每个配置带来的影响。

```js
module.exports = {
  //...
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
};
```

### splitChunks.chunks

对准备打包的文件提取那些模块作为新的模块，字符串，分别为 async、initial、all

- 默认值`async`：只提取异步加载的模块出来打包到一个文件中。
  - 异步加载的模块，有很多种实现方式
    - vue 异步组件：(resolve) => require(['@/components/home'], resolve)
    
    - webpack 的 `require.ensure()`：(resolve) => require.ensure([], () => resolve(require('@/components/home')), 'home')
    
    - ES6 的 import()：() => import('@/components/home')
    
      详细解析参考：https://segmentfault.com/a/1190000038180453
  
- `initial`：提取同步加载和异步加载模块，如果xxx在项目中异步加载了，也同步加载了，那么xxx这个模块会被提取两次，分别打包到不同的文件中。
  
  - 同步加载的模块：通过 `import xxx`或`require('xxx')`加载的模块。
  
- `all`：不管异步加载还是同步加载的模块都提取出来，打包到一个文件中，官方也说，可能最有用「Providing `all` can be particularly powerful, because it means that chunks can be shared even between async and non-async chunks.」。

### splitChunks.minSize

默认值：30000「30kb」

被提取模块在压缩前的大小最小值，单位为字节，，只有超过了30000字节才会被提取。

#### 打包优先级

minSize > maxSize  > maxInitialRequest/maxAsyncRequests

设置 `maxSize` 的值会同时设置 `maxAsyncSize` 和 `maxInitialSize` 的值。

### splitChunks.maxSize

默认值：0，表示不限制大小。

被提取出来模块打包生成的文件大小不能超过maxSize值，如果超过了，要对其进行分割并打包生成新的文件。单位为字节

### splitChunks.minChunks

默认值：1

被提取模块最小被引用次数，引用次数超过或等于minChunks值，才会被提取。

### splitChunks.maxAsyncRequests

默认值：30

最大的按需(异步)加载并行请求数量。

### splitChunks.maxInitialRequests

默认值：30

打包后的入口文件加载时，还能同时加载文件的数量（包括入口文件）

### splitChunks.automaticNameDelimiter

打包生成文件名的分割符，默认为`~`。

### splitChunks.name

默认值：true，为true时，splitChunks基于chunk和cacheGroups的key自动命名。

打包生成文件的名称，可以设置 boolean、()=>{}，更多的用处应该是在 `splitChunks.cacheGroups.{cacheGroup}.name`。

https://webpack.docschina.org/plugins/split-chunks-plugin/#splitchunksname

### splitChunks.cacheGroups

缓存组可以继承和/或覆盖来自 `splitChunks.*` 的任何选项。但是 `test`、`priority` 和 `reuseExistingChunk` 只能在缓存组级别上进行配置。将它们设置为 `false`以禁用任何默认缓存组。核心重点，**配置提取模块的方案**。里面每一项代表一个提取模块的方案。下面是 `cacheGroups` 每项中特有的选项，其余选项和  `splitChunks.*`  一致，`cacheGroups`  优先级高于 `splitChunks.*`。`cacheGroups` 有两个默认的组，一个是 `vendors`，将所有来自 `node_modules` 目录的模块；一个 `default`，包含了由两个以上的 chunk 所共享的模块。

chunk名字组成，例如 `vendors~app`（默认由 `cacheGroups` 中组的 key + 源chunk名组成）。

使用：splitChunks.cacheGroups.xxxcacheGroup，cacheGroups 包含着多个自定义的cacheGroup。

- `test`：`RegExp`｜ `string`，用来匹配要提取的模块的资源路径或名称。

- `priority`：`number`，方案的优先级，值越大表示提取模块时优先采用此方案。默认值为0，splitChunks.* 的优先级为负数。

- `reuseExistingChunk`：`boolean`，为`true`时，如果当前 chunk 包含已从主 bundle 中拆分出的模块，则它将被重用，而不是生成新的模块。这可能会影响 chunk 的结果文件名。

- `enforce`：`boolean`，为`true`时，忽略`minSize`，`minChunks`，`maxAsyncRequests`和`maxInitialRequests`splitChunks.* 中的选项，始终为此缓存组创建 chunk。

- `filename`：`string` `function (pathData, assetInfo) => string`，自定义输出文件名，不建议在splitChunks.* 这一层设置。

- `type`：`RegExp`｜ `string`，根据文件类型分配到 cacheGroups 处理，比如 `json`

  - ```js
    module.exports = {
      //...
      optimization: {
        splitChunks: {
          cacheGroups: {
            json: {
              type: 'json',
            },
          },
        },
      },
    };
    ```

    


## 场景

**1. 为什么要进行代码分割？**
代码分割最基本的任务是分离出第三方依赖库，因为第三方库的内容可能很久都不会变动，所以用来标记变化的摘要哈希`contentHash`也很久不变，这也就意味着我们可以利用本地缓存来避免没有必要的重复打包，并利用浏览器缓存避免冗余的客户端加载。另外当项目发布新版本时，如果第三方依赖的`contentHash`没有变化，就可以使用客户端原来的缓存文件（通用的做法一般是给静态资源请求设置一个很大的`max-age`），提升访问速度。另外一些场景中，代码分割也可以提供对脚本在整个加载周期内的加载时机的控制能力。
**2. 代码分割的使用场景**
举个很常见的例子，比如你在做一个数据可视化类型的网站，引用到了百度的`Echarts`作为第三方库来渲染图表，如果你将自己的代码和`Echarts`打包在一起生成一个`main.bundle.js`文件，这样的结果就是在一个网速欠佳的环境下打开你的网站时，用户可能需要面对很长时间的白屏，你很快就会想到将`Echarts`从主文件中剥离出来，让体积较小的主文件先在界面上渲染出一些动画或是提示信息，然后再去加载`Echarts`，而分离出的`Echarts`也可以从速度更快的`CDN`节点获取，如果加载某个体积庞大的库，你也可以选择使用懒加载的方案，将脚本的下载时机延迟到用户真正使用对应的功能之前。这就是一种人工的代码分割。
从上面的例子整个的生命周期来看，我们将原本一次就可以加载完的脚本拆分为了两次，这无疑会加重服务端的性能开销，毕竟建立TCP连接是一种开销很大的操作，但这样做却可以换来**对渲染节奏的控制和用户体验的提升**，**异步模块**和**懒加载模块**从宏观上来讲实际上都属于**代码分割**的范畴。`code splitting`最极端的状况其实就是拆分成打包前的原貌，也就是**源码直接上线**。



- node_modules中的模块或其他被重复引用的模块
  就是说如果引用的模块来自`node_modules`,那么只要它被引用，那么满足其他条件时就可以进行自动分割。否则该模块需要被重复引用才继续判断其他条件。（对应的就是下文配置选项中的`minChunks`为1或2的场景）
- 分离前模块最小体积下限（默认30k，可修改）
  30k是官方给出的默认数值，它是可以修改的，上一节中已经讲过，每一次分包对应的都是服务端的性能开销的增加，所以必须要考虑分包的性价比。
- 对于异步模块，生成的公共模块文件不能超出5个（可修改）
  触发了懒加载模块的下载时，并发请求不能超过5个，对于稍微了解过服务端技术的开发者来说，**【高并发】**和**【压力测试】**这样的关键词应该不会陌生。
- 对于入口模块，抽离出的公共模块文件不能超出3个（可修改）
  也就是说一个入口文件的最大并行请求默认不得超过3个，原因同上。



通过 bundle-analysis 分析最后打包的成果
