[掘金链接](https://juejin.cn/post/7097147699254231047)

## 概念
BFC，全称 Block Formatting Context，意为**块格式化上下文**，[MDN](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Block_formatting_context) 上的定义是：BFC 是 Web 页面的可视 CSS 渲染的一部分，是块级盒子的布局过程发生的区域，也是浮动元素与其他元素交互的区域。

通俗来讲：BFC 是一个独立的容器，在这个容器的元素布局不受外部影响，也不会影响到外部布局。

## 解决的问题
概念很绕，也没啥理解的价值，只要记住 BFC 一般用于处理这几种问题就好了

### 高度塌陷
看下面这个例子，给子 `div` 设置了浮动，导致其脱离了文档流，父元素高度塌陷了。

通过给容器设置 `display: flow-root`，使其变为 BFC，在计算高度时包含内部浮动元素，解决高度塌陷。

**HTML**
```html
<section>
  <div class="box">
    <div class="float">我是一个浮动的盒子</div>
    <p>我是普通容器里的文字</p>
  </div>
</section>
<section>
  <div class="box" style="display: flow-root">
    <div class="float">我是一个浮动的盒子</div>
    <p>
      我是
      <code>display:flow-root</code>
      容器里的文字
    </p>
  </div>
</section>
```
**CSS**
```css
section {
  height: 150px;
}
.box {
  background-color: rgb(224, 206, 247);
  border: 5px solid rebeccapurple;
}
.box[style] {
  background-color: aliceblue;
  border: 5px solid steelblue;
}
.float {
  float: left;
  width: 200px;
  height: 100px;
  background-color: rgba(255, 255, 255, 0.5);
  border: 1px solid black;
  padding: 10px;
}
```

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/85b1f6329ff947328e51098342a3ea21~tplv-k3u1fbpfcp-watermark.image?)

### 外边距重叠
两个块级元素的上外边距和下外边距可能会合并为一个外边距，其值会取其中值大的那个，这种行为就是外边距折叠。重叠只会出现在**垂直方向**。

通过给容器设置 `display: flow-root`，使其变为 BFC，与其他外部元素互不影响，解决外边距重叠。

**HTML**
```html
<div class="container">
  <div>
    <div class="box">我是普通容器中的盒子</div>
  </div>
  <div class="box">我是普通盒子</div>
</div>
<div class="container">
  <div style="display: flow-root">
    <div class="box">我是 BFC 中的盒子</div>
  </div>
  <div class="box">我是普通盒子</div>
</div>
```
**CSS**
```css
.container {
  border: 5px solid rebeccapurple;
}
.box {
  width: 200px;
  height: 50px;
  background-color: rgb(224, 206, 247);
  margin: 50px;
}
```

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a5980975960548d0930f0677b064d82f~tplv-k3u1fbpfcp-watermark.image?)

### 浮动元素覆盖
浮动元素会脱离文档流，导致覆盖另一个元素，可以使另一元素成为 BFC 与浮动元素互不影响。

**HTML**
```html
<div class="container">
  <div class="float">我是浮动的盒子</div>
  <div class="box">我是普通盒子</div>
</div>
<div class="container">
  <div class="float">我是浮动的盒子</div>
  <div class="box" style="display: flow-root">我是普通盒子</div>
</div>
```
**CSS**
```css
.container {
  border: 5px solid rebeccapurple;
}
.box {
  width: 200px;
  height: 200px;
  background-color: rgb(224, 206, 247);
}
.float {
  width: 100px;
  height: 100px;
  float: left;
  background-color: aliceblue;
}
```
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9ccd3d8d411d4c18bb59d56fb0f354de~tplv-k3u1fbpfcp-watermark.image?)

以上就是一般使用 BFC 处理的三种问题。

## 设置 BFC
一般有以下方式设置 BFC
* 根元素：`<html>`
* 浮动元素：`float` 值不为 `none`
* 绝对定位元素：`position` 为 `absolute` 或 `fixed`
* 行内块元素：`display` 值为 `inline-block`
* 表格元素：`display` 值为 `table`、`table-cell`、`table-caption`、`inline-table`等
* `overflow` 值不为 `visible`、`clip` 的块元素
* `display` 为 `flow-root` 的元素
* `contain` 值为 `layout`、`content` 或 `paint` 的元素
* 弹性元素：`display` 值为 `flex` 或 `inline-flex` 元素的直接子元素
* 网格元素：`display` 值为 `grid` 或 `inline-grid` 元素的直接子元素
* 多列容器：`column-count` 或 `column-width` 值不为 `auto` 的元素
* `column-span` 值为 `all` 的元素始终会创建一个新的 BFC，即使该元素没有包裹在一个多列容器中

> flex/grid 容器（`display`：flex/grid/inline-flex/inline-grid）建立新的 flex/grid 格式上下文，除布局之外，它与 BFC 类似。flex/grid 容器中没有可用的浮动子级，但排除外部浮动和阻止外边距重叠仍然有效。

