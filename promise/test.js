const Promise = require("./promise");

new Promise((resolve, reject) => {
  // debugger;
  console.log("开始了");
  resolve(1);
}).then((res) => {
  console.log(res, "获取到的数据");
});
