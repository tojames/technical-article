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

就形成了 3 * 3 个 100px宽 * 100px高 这样的9个盒子

grid-template-areas
	对应上面的九个盒子，可以为它们给几个名字，方便对每个盒子放置元素
	grid-template-areas:'a b c' 'd e f' 'g h i'; 就是给9个盒子分别起名字


grid-column-gap 属性设置列与列的间隔（列间距）
	grid-column-gap:10px
grid-row-gap 属性设置行与行的间隔（行间距）
	grid-row-gap:10px
grid-gap 合并简写
	grid-gap: <grid-row-gap> <grid-column-gap>; 如果只填写一个值，则默认是第二值等于第一个值

设置单元格对齐方式，作用多个盒子
justify-items 水平方向
align-items	垂直方向
place-items 合并简写，同上
	取值 start | end | center | stretch（默认值）

设置整个内容区域在容器里面对齐方式
justify-content 水平方向
align-content 垂直方向
place-content 合并简写，同上
	取值 start | end | center | stretch | space-around | space-between | space-evenly;
	最激动人心的是 space-evenly，项目与项目的间隔相等，项目与容器边框之间也是同样长度的间隔。
它比space-around好在不用控制边框的距离烦恼

 在一个已设置grid列和宽的网格盒子中新增直接子元素，为没有设置行行和列宽的盒子设置一个初始的高度/宽度，如没有设置由内容撑开
grid-auto-columns 初始50高度 50px 
grid-auto-rows 初始50宽度 50px

grid-auto-flow 设置网格的布局方式，默认值是 “先行后列” 
	取值 column row 还可以加上一个补充属性 dense
	比如 grid-auto-flow:row dense 就是在行上面只要有空间就会下面的元素就会跑上来，这样的好处就是更加紧凑了，
举个例子 当显示朋友圈点赞人数，并不在意点赞顺序时，会出现名字长短不一，这就对我们布局产生影响，我们可以使用 row dense 名字长的放不下，在下面一行，剩余的空间给放得下的。这样就很紧凑
	

grid-template 是grid-template-columns、grid-template-rows和grid-template-areas这三个属性的合并简写形式
不推荐使用

grid属性是grid-template-rows、grid-template-columns、grid-template-areas、 grid-auto-rows、grid-auto-columns、grid-auto-flow这六个属性的合并简写形式，不推荐使用

```

## **子项目属性**

网格线比内容多一条，比如  3 * 3 的九宫格，把所有的格子都围起来就需要 4条列线，4条行线。对应起来就是每个单元格的线

```css
grid-column-start 左边框所在的垂直网格线
grid-column-end 右边框所在的垂直网格线
grid-row-start 上边框所在的水平网格线
grid-row-end 下边框所在的水平网格线
	取值 数字	grid-column-start: 2; grid-column-end: 4; grid-row-start:2;grid-row-start:4
	将当前的item 从列线第二条开始，第四条结束,从行线第二条开始，第四条结束
不想写距离的行数或列数可以使用，span ，比如 grid-column-start:span 2,从当前项目的列线的开始跨域两个单元格


grid-column 是grid-column-start和grid-column-end的合并简写形式
	取值 数字 中间‘/’隔开  grid-column: <start-line> / <end-line>;

grid-row grid-row-start属性和grid-row-end的合并简写形式
  取值 数字 中间‘/’隔开 grid-row: <start-line> / <end-line>;

grid-area 指定项目放在哪一个区域。

属性设置单元格内容的水平位置（左中右），只作用于单个盒子
justify-self
align-self
取值 start | end | center | stretch;
place-self 是 align-self 属性和 justify-self 属性的合并简写形式
	取值 place-self: <align-self> <justify-self>;
```



## 字节面试题

**使用 Grid 布局，使 left 两个元素向左对齐，right 两个元素向右对齐**

```html
<div class="container">
  <div class="left"></div>
  <div class="left"></div>
  <div class="right"></div>
  <div class="right"></div>
</div>
  <style>
  .container {
      display: grid;
      grid-gap: 10px;
      grid-template-columns: 100px 100px 1fr 100px 100px;
      /* grid-template-columns: auto auto 1fr auto auto; */
      font-size: 2em;

    }

    .right:nth-child(3) {
      grid-column-start: 4;
    }


    .son-1 {
      background-color: skyblue;
    }
    .son-2 {
      background-color: pink;
    }
    .son-3 {
      background-color: hotpink;
    }
    .son-4 {
      background-color: #999;
    }
    
 </style>
```

