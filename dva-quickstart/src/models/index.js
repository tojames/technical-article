/* 
  解决当我们的model越写越多的时候，将会在入口文件中引入太多现在的重复代码
*/

const context = require.context("./", false, /\.js$/);
export default context
  .keys()
  .filter((item) => item !== "./index.js")
  .map((key) => context(key));
