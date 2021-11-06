# Grid布局（网格布局）

> [阮一峰写grid布局非常棒](https://www.ruanyifeng.com/blog/2019/03/grid-layout-tutorial.html)
>
> 当设置了 grid的盒子会生成一个 GFC（grid formatting context）网格格式化上下文，它的直接子元素会生成一个BFC（Block Formatting context）块级格式化上下文  
>
> [关于格式化上下文](https://juejin.cn/post/7024678256267755556)



**注意，Grid布局很强大，请使用它，特别是涉及二维的布局，兼容性目前除了IE外，大部分浏览器已兼容，移动端兼容性更佳**

**优点：**

- flex布局有的它都有，但是一维布局还是首选flex，比flex更强大
- 非常灵活，自适应能力高
- 可以使用行号、列号、网格区域名称，可以定位到元素的位置。网格外的元素也可以按照行号、列号放置



## **容器属性**

```css
display:grid/inline-grid 
	都可以设置网格布局，一个是块级，一个是行内块

grid-template-rows
	设置行比如 grid-template-rows:repeat(3,100px) 
	上面 repeat 是重复3次的100px === 100px 100px 100px,就设置了 3列的100px宽的盒子

grid-template-columns
	设置列比如 grid-template-columns:repeat(3,100px) 
	设置了 3列的100px高的盒子

就形成了 3 * 3  100px宽 * 100px高 这样的9个盒子

grid-template-areas
	对应上面的九个盒子，可以为它们给几个名字，方便以后拿来拓展这个网格
	grid-template-areas:'a b c' 'd e f' 'g h i'; 就是给9个盒子分别起名字

grid-template 是grid-template-columns、grid-template-rows和grid-template-areas这三个属性的合并简写形式
不推荐使用

grid属性是grid-template-rows、grid-template-columns、grid-template-areas、 grid-auto-rows、grid-auto-columns、grid-auto-flow这六个属性的合并简写形式，不推荐使用

grid-column-gap
grid-row-gap
grid-gap
justify-items
align-items
place-items
justify-content
align-content
place-content
grid-auto-columns
grid-auto-rows
grid-auto-flow


flex-direction: 设置主轴的方向 
取值
	row（默认值）：主轴为水平方向，起点在左端。
	row-reverse：主轴为水平方向，起点在右端。
	column：主轴为垂直方向，起点在上沿。
	column-reverse：主轴为垂直方向，起点在下沿。


```

## **子项目属性**

```css
grid-column-start
grid-column-end
grid-row-start
grid-row-end
grid-column
grid-row
grid-area
justify-self
align-self
place-self
```



## 字节面试题

**使用 Grid 布局，使 left 两个元素向左对齐，right 两个元素向右对齐**

