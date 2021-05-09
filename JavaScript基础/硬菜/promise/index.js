// new Promise((resolve, reject) => {
//   resolve(1);
// })
//   .then((res) => {
//     return new Promise((resolve2, reject2) => {
//       resolve2(1);
//     });
//   })
//   .then((res2) => {
//     console.log(res2, "res2");
//   });

let p1 = new Promise((resolve) => {
  resolve(1);
});

let p2 = p1.then((value) => {
  return p2;
});
