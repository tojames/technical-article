const path = require("path")
import myMethods from "./myMethods"
import printJS from "./print"
import "../css/mycss.css" //引入css
//引入bootstrap
import "../bootstrap-3.3.7-dist/css/bootstrap.min.css"
// import jQuery from "../bootstrap-3.3.7-dist/js/jquery"
// import "../bootstrap-3.3.7-dist/js/bootstrap.js";
var myInput = document.querySelectorAll("input")
var myButton = document.querySelector("button")

//因为服务器的路径的原因,所以我的图片路径直接设置是base64
let img = new Image()
img.src =
  "data:image/png;base64,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M3rvVz/Rk+X8lQGN+KZWf/mbcgZLajumV377Y/++f9Tt9idf0aNTPY8ZbVNT2Wr9YNNQ/AJDdBjwv2Nua2nWsf1valvJdlWf6vv2wGdfpB6anKvkcEmXzujd3z6mjX0e/uJd2/kz+usfK7T9ha16q4mFlKGu3yHdvPjr2nwlRgIMe83a+IefK3rkHP3jQK5+1NL/r4rauyJbewd/YLjCjHvtAQB8aQkAGBFSADAipABgREgBwIiQAoARIQUAI0IKAEaEFACMCCkAGBFSADAipABgREgBwIiQAoARIQUAI0IKAEaEFACMCCkAGBFSADAipABgREgBwIiQAoARIQUAI0IKAEaEFACMCCkAGBFSADAipABgREgBwIiQAoARIQUAI0IKAEaEFACMCCkAGBFSADAipABgREgBwIiQAoARIQUAI0IKAEaEFACMCCkAGBFSADAipABgREgBwIiQAoARIQUAI0IKAEaEFACMCCkAGBFSADAipABgREgBwIiQAoARIQUAI0IKAEaEFACMCCkAGBFSADAipABgREgBwIiQAoARIQUAI0IKAEaEFACMCCkAGBFSADAipABgREgBwIiQAoARIQUAI0IKAEaEFACMCCkAGBFSADAipABgREgBwIiQAoARIQUAI0IKAEaEFACM/h8ur02/ES2YFQAAAABJRU5ErkJggg=="
console.log(img.src)
document.body.appendChild(img)

printJS()
myButton.onclick = function () {
  var inputValue = +myInput[0].value
  var inputValue2 = +myInput[1].value
  myInput[2].value = myMethods.methods.calcSum(inputValue, inputValue2)
}
