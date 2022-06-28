# Path模块



## 常用的路径分类

```js
__dirname： 获得当前执行文件所在目录的完整目录名
__filename： 获得当前执行文件的带有完整绝对路径的文件名 
process.cwd()：获得当前执行 node 命令时候的文件夹目录名 
./和../： 不使用 require 时候，./与process.cwd()一样，使用require时候，与__dirname一样 

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



## path

> 这是node核心模块，官网地址：http://nodejs.cn/api/path.html

### path.normalize

```ts
const path = require('path')
console.log(path.normalize('/Users/atoe/Desktop/blog/tools//tools-node//123//..'));
console.log(path.normalize('/Users/atoe/Desktop/blog/tools//tools-node//123//'));

/Users/atoe/Desktop/blog/tools/tools-node
/Users/atoe/Desktop/blog/tools/tools-node/123/
解析：
	1、它会将 // 格式化为 /， 
 	2、.. 会返回上一层

总结：规范化路径，把不规范的路径规范化。
```



### path.join

```ts
const path = require('path')
console.log(path.join('src', 'task.js'))

console.log(path.join('')) 

src/task.js
.

总结：path.join([...paths])，
	1、传入的参数是字符串的路径片段，可以是一个，也可以是多个 
  2、返回的是一个拼接好的路径，但是根据平台的不同，他会对路径进行不同的规范化，举个例子，Unix系统是/，Windows系统是\，那么你在两个系统下看到的返回结果就不一样。 
  3、如果返回的路径字符串长度为零，那么他会返回一个.，代表当前的文件夹。 
	4、如果传入的参数中有不是字符串的，那就直接会报错
```



### path.parse

```ts
const path = require('path')
console.log(path.parse('/Users/atoe/Desktop/blog/tools/tools-node/a.js'));

{
  root: '/',
  dir: '/Users/atoe/Desktop/blog/tools/tools-node/',
  base: 'a.js',
  ext: '.js',
  name: 'a'
}

总结:它返回的是一个对象：
	root：代表根目录
	dir：代表文件所在的文件夹
	base：代表整一个文件
	name：代表文件名
	ext: 代表文件的后缀名

```



### path.basename

```ts
console.log(path.basename('/Users/atoe/Desktop/blog/tools/tools-node/src/')); // src
console.log(path.basename('/Users/atoe/Desktop/blog/tools/tools-node/src/test.js', '.js')); // test

总结
	basename 接收两个参数，第一个是path，第二个是ext(可选参数)，当输入第二个参数的时候，打印结果不出现后缀名
```



### path.dirname

```ts
console.log(path.dirname('/Users/atoe/Desktop/blog/tools/tools-node/src/test.js'));

/Users/atoe/Desktop/blog/tools/tools-node/src

总结:返回文件的目录完整地址
```



### path.extname

```ts
console.log(path.extname('index.html'), 1);
console.log(path.extname('index.coffee.md'), 2);
console.log(path.extname('index.'), 3);
console.log(path.extname('index'), 4);
console.log(path.extname('.index'), 5);

.html 1
.md 2
. 3
 4
 5

总结:返回的是后缀名，但是最后两种情况返回'',大家注意一下。
```



### path.resolve

```ts
const path = require('path')
console.log(path.resolve('/foo/bar', '/bar/faa', '..', 'a/../c'))

/bar/c

总结：path.resolve([...paths])
path.resolve 就相当于是 shell 下面的cd操作，从左到右运行一遍cd path命令，最终获取的绝对路径/文件名，这个接口所返回的结果了。但是resolve操作和cd操作还是有区别的，resolve的路径可以没有，而且最后进入的可以是文件。具体cd步骤如下
cd /foo/bar/    //这是第一步, 现在的位置是/foo/bar/
cd /bar/faa     //这是第二步，这里和第一步有区别，他是从/进入的，也就时候根目录，现在的位置是/bar/faa
cd ..       //第三步，从faa退出来，现在的位置是 /bar
cd a/../c   //第四步，进入a，然后在推出，在进入c，最后位置是/bar/c
        
```



```ts
const path = require('path')

console.log(path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb')) // ../../impl/bbb
console.log(path.relative('/data/demo', '/data/demo'))  // ""
console.log(path.relative('./test', '')); // ".."

总结: path.relative(from, to) 
	描述：从 from 路径，到 to 路径的相对路径。 
  边界：如果 from、to 指向同个路径，那么，返回空字符串。 
  		  如果 from、to 中任一者为空，那么，返回当前工作路径。
```



参考 http://www.inode.club/node/path.html#path
