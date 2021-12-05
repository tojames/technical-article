# Vue全览

## 数据相关的实例方法 

 $set  

$delete 

$watch 都在observer文件上面

挂载在Vue.prototype上

## 事件相关的方法

$on

$off

$once 

$emit

在enentsMixin中有定义 

挂载在Vue.prototype上



## 生命周期的实例方法

$forceUpdate

$destory

$nextTick

$mount



## 全局API的实现原理

挂载在Vue上的api

Vue.extend

Vue.nextTick === $nextTick

Veu.set === $set

Vue.delete===$delete 

Vue.directive 重点

Vue.filter

Vue.component

Vue.use

Vue.mixin

Vue.compile

Vue.version





