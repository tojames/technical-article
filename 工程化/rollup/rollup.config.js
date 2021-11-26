import babel from "rollup-plugin-babel";
import serve from "rollup-plugin-serve";

export default {
  input: "./src/index.js", // 入口文件，以这个入口文件打包库,不用绝对路径
  // 导出文件
  output: {
    format: "umd", // 模块化的类型
    name: "Vue", // 打包出来的全局变量的名字
    file: "dist/umd/vue.js", // 打包出来的文件
    sourcemap: true, // 资源地图
  },
  plugins: [
    // 排除node_modules 打包
    babel({
      exclude: "node_modules/**",
    }),
    serve({
      // open: true, // 打开浏览器
      port: 3000,
      contentBase: "", // 以当前目录为基准
      openPage: "index.html", // 当前打开的页面
    }),
  ],
};
