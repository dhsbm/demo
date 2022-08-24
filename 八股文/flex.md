## 容器的属性
以下6个属性设置在容器上。

* flex-direction:row 主轴的方向
* flex-wrap:nowrap 是否换行
* flex-flow:: `flex-direction` || `flex-wrap`  简写形式
* justify-content:flex-start 主轴上的对齐方式
* align-items:stretch 交叉轴的对齐方式
* align-content:stretch 根轴线的对齐方式

## 项目的属性
* order:0 定义项目的排列顺序。数值越小，排列越靠前。
* flex-grow:0 定义项目的放大比例
* flex-shrink:0 定义了项目的缩小比例
* flex-basis:auto 定义了在分配多余空间之前，项目占据的主轴空间
* flex:0 1 auto 简写
* align-self:auto 属性允许单个项目有与其他项目不一样的对齐方式，

## flex 值含义
* flex-grow 按比例拉长
* flex-shrink 按比例缩小，缩小至0则移除重新计算
* flex-basis 基准值

## flex 简写语法
* 单值语法: 值必须为以下其中之一：
  * 一个无单位数 (`number`): 它会被当作flex:`number` 1 0; `flex-shrink`的值被假定为 1，然后`flex-basis` 的值被假定为0。
  * 一个有效的**宽度**值：它会被当作 `flex-basis`的值。
  * 关键字none，auto或initial.
* 双值语法: 第一个值必须为一个无单位数，并且它会被当作 `flex-grow` 的值。第二个值必须为以下之一：
  * 一个无单位数：它会被当作 `flex-shrink` 的值。
  * 一个有效的宽度值：它会被当作 `flex-basis` 的值。

* 三值语法：
  * 第一个值必须为一个无单位数，并且它会被当作 `flex-grow` 的值。
  * 第二个值必须为一个无单位数，并且它会被当作 `flex-shrink` 的值。
  * 第三个值必须为一个有效的宽度值，并且它会被当作 `flex-basis` 的值。