const Promise = require("./promise")
debugger
new Promise((resolve, reject) => {
  resolve(1)
})
  .then((res) => {
    console.log(res, "res")
    return res + "一次then的结果"
  })
  .then((res2) => {
    console.log(res2, "res2")
  })
