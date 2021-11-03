# css预处理器

## **CSS预处理器**

 CSS预处理器是一种专门的编程语言，用来为CSS增加一些编程特性（CSS本身不是编程语言）。
 不需要考虑浏览器兼容问题，因为CSS预处理器最终编译和输出的仍是标准的CSS样式，只需要看该样式是否被兼容。可以在CSS预处理器中：使用变量、简单逻辑判断、函数等基本编程技巧。

##  **CSS预处理器主要目的**

- CSS语法不够强大（例如：CSS选择器无法进行嵌套，导致CSS中存在较多重复的选择器语句）；CSS中无法定义变量以及没有合理的样式复用机制，导致整体CSS样式难以维护。

- 为了减少CSS代码冗余，为CSS提供样式可复用，提高CSS代码的可维护性。

**lang的意义是语言选择器:lang(language)**，所以可以通过这个属性确定选择哪一种选择器预处理器。

## 主流CSS预处理器

### Sass

> 世界上最成熟、最稳定、最强大的专业级CSS扩展语言！
>
> 2007，最早最成熟的CSS预处理器，有两种语法，分别以 .sass 和 .scss 为扩展名。SCSS是Sass 3引入的新语法，完全兼容CSS3，并继承了Sass的强大功能，和CSS语法结构更接近

**优点**：让CSS更加简洁、适应性更强、更易于代码的维护。

**缺点**：css的文件体积和复杂度不可控、调试难度增加、node-sass 安装容易出问题（非 Sass 本身的缺点，dart-sass 可代替）。

**使用**

```js
1.
在 uniapp 下使用sass。 直接下载插件就可以了，插件名为 'scss/sass'
使用的时候 加上 'lang="scss"' 字段即可 <style lang="scss"></style> 

2.
2. 在pc 下使用sass。 cnpm i sass -D cnpm i sass-loader 。有一个注意点就是 lang="scss"。不能用sass
```

**语法**

```css
参考网址 https://www.sass.hk/ 

1.变量的使用
$link-color: blue;
a {
  color: $link_color;
}

2.css 嵌套规则
#content {
  article {
    h1 { color: #333 }
    p { margin-bottom: 1.4em }
  }
  aside { background-color: #EEE }
}
    父选择器的标识符&; 
    article a {
  		color: blue;
  		&:hover { color: red } // 这里的&符号是a，相当于a在hover的时候触发
		}
3. 导入SASS文件;
    @import "url"
```



### Less 

> 是一门 CSS 预处理语言，它扩展了 CSS 语言，增加了变量、Mixin、函数等特性，使 CSS 更易维护和扩展。
>
> Less 可以运行在 Node 或浏览器端。

**优点**：有点同sass差不多，并多了实现主题定制功能

缺点：编程能力弱，有很多语法不支持，

**使用**

```js
1.
在 uniapp 下使用less。 直接下载插件就可以了，插件名为 'less编译'
使用的时候 加上 'lang="less"' 字段即可 <style lang="less"></style> 

2. 在pc 下使用less。 cnpm i less -D cnpm i less-loader
```

**语法**

```css
参考网址 https://less.bootcss.com/#%E6%A6%82%E8%A7%88
1.变量 
@width: 10px;
#header {
  width: @width;
  height: @height;
}
2.嵌套
#header {
  color: black;
  .navigation {
    font-size: 12px;
  }
  .logo {
    width: 300px;
  }
}
3.运算
@base: 5%;
@filler: @base * 2; // 结果是 10%
注意：px 到 cm 或 rad 到 % 的转换。 * / 不支持转换

4 导入 @import "library"; 

less 比 sass 语法更加丰富。
```



### Stylus 

> 富于表现力、动态的、健壮的 CSS

stylus大概和sass/less差不多，stylus体现在更加简洁

```js
1.
在 uniapp 下使用stylus。 直接下载插件就可以了，插件名为 'stylus编译'
使用的时候 加上 'lang="stylus"' 字段即可 <style lang="stylus"></style> 

2. 在pc 下使用stylus。 cnpm i stylus -D  cnpm i stylus-loader -D
```

**语法**

```css
参考网址 https://stylus.bootcss.com/

冒号可有可无
	a.button{
  	border-radius(5px);
	}	
分号可有可无
	a.button{
  	border-radius(5px)
	}
括号可有可无
		a.button
  		border-radius: 5px;
逗号可有可无
变量
插值（Interpolation）
混合（Mixin）
数学计算
强制类型转换
动态引入
条件表达式
迭代
嵌套选择器
父级引用
Variable function calls
词法作用域
内置函数（超过 60 个）
语法内函数（In-language functions）
压缩可选
图像内联可选
Stylus 可执行程序
健壮的错误报告
单行和多行注释
CSS 字面量
字符转义
TextMate 捆绑
以及更多！

stylus 比 less 语法更丰富，书写更整洁。
```

###  PostCSS

PostCSS 是目前最为流行的 CSS 预/后处理器。PostCSS 本体功能比较单一，它提供一种用 JavaScript 来处理 CSS 的方式。PostCSS 会把 CSS 解析成 AST（Abstract Syntax Tree 抽象语法树），之后由其他插件进行不同的处理。

#### 功能

PostCSS 本体功能比较单一，大多数的 CSS 处理功能都由插件提供，下面是一些常用的插件：

- [Autoprefixer](https://github.com/postcss/autoprefixer) 为 CSS 中的属性添加浏览器特定的前缀。
- [postcss-preset-env](https://github.com/csstools/postcss-preset-env) 根据 `browserslist` 指定的目标浏览器将一些 CSS 的新特性转换为目标浏览器所支持的语法。
- [cssnano](https://github.com/cssnano/cssnano) 提供 CSS 压缩功能。
- [postcss-nested](https://github.com/postcss/postcss-nested) 提供 CSS 嵌套功能。
- [postcss-px-to-viewport](https://github.com/evrone/postcss-px-to-viewport) 提供 px 转 vw 功能。
- [postcss-custom-properties](https://github.com/postcss/postcss-custom-properties) 支持 CSS 的自定义属性。

#### 优点

- 插件系统完善，扩展性强。
- 配合插件功能齐全。
- 生态优秀。

#### 缺点

- 配置相对复杂。

### 