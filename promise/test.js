const Promise = require("./promise");
debugger;
new Promise((resolve, reject) => {
  resolve(1);
})
  .then((res) => {
    return new Promise((resolve2, reject2) => {
      resolve2(
        new Promise((resolve3, reject3) => {
          resolve3(1);
        })
      );
    });
  })
  .then((res2) => {
    console.log(res2, "res2");
  });
