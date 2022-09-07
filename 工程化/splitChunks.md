# splitChunks

当项目代码变大、变多依赖复杂，如果简单打包。

- 会出现重复打包，最后导致 `dist` 文件偏大，**文件大小需要优化**
- 重复打包后，文件重复引入，**http请求数需要优化**
- 文件打包后过大，过小，**过大：文件大小需要优化，过小：http请求数需要优化**

**解决问题：提取公共代码，防止代码被重复打包，拆分过大的 javascript 文件，合并零散的 javascript 文件**

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

