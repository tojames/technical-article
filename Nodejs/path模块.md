# Path模块

> 官网：http://nodejs.cn/api/path.html

```js
__dirname： 获得当前执行文件所在目录的完整目录名
__filename： 获得当前执行文件的带有完整绝对路径的文件名 
process.cwd()：获得当前执行 node 命令时候的文件夹目录名 
./： 不使用 require 时候，./与process.cwd()一样，使用require时候，与__dirname一样 

./ 比较特殊解析一下

比如：
const fs = require('fs');
fs.readFile('./nest-cli.json', (err,data) => {
  console.log(err, 'err');
});

[Error: ENOENT: no such file or directory, open './nest-cli.json'] {
  errno: -2,
  code: 'ENOENT',
  syscall: 'open',
  path: './nest-cli.json'
} 

同级目录的 nest-cli.json 文件确实存在，但是就是访问出错了。
改为如下即可访问
fs.readFile(__dirname + '/nest-cli.json', 'utf-8', (err, data) => {
  console.log(data, 'data'); //
});

再比如：
const res = require('./nest-cli.json');
console.log(res, 'res');
这种是可以访问的。

小结：
在 require()中使用是跟__dirname 的效果相同，不会因为启动脚本的目录不一样而改变，在其他情况下跟 process.cwd() 效果相同，是相对于启动脚本所在目录的路径。
```

