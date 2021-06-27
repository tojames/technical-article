import { forEachValue } from "../utils"
import Module from "./module"

export default class ModuleCollection {
  constructor(options) {
    // 递归处理数据

    this.register([], options) // statck = [根，子，孙]
  }
  // 获取命名空间前缀
  getNamespaced(path) {
    let root = this.root // 从根模块找
    return path.reduce((str, key) => {
      root = root.getChild(key) //  不停去找当前模块
      return str + (root.namespaced ? key + "/" : "")
    }, "")
  }

  register(path, rootModule) {
    // 格式化的结果，返回一个实例处理并且将方法带出来
    let newModule = new Module(rootModule)

    if (path.length === 0) {
      // 根模块
      this.root = newModule
    } else {
      // path.slice(0,-1) 把自己排除，找爷爷 爸爸
      // console.log(path, "path.slice(0, -1)")
      let parent = path.slice(0, -1).reduce((memo, current) => {
        // return memo._children[current];
        return memo.getChild(current)
      }, this.root)

      parent.addChild(path[path.length - 1], newModule)
      // patent._children[path[path.length - 1]] = newModule;
      // console.log(parent, "parent")
      // console.log(parent, "path[path.length - 1]")
    }

    if (rootModule.modules) {
      forEachValue(rootModule.modules, (module, moduleName) => {
        // [a]
        // [b]
        this.register([...path, ...moduleName], module)
      })
    }
  }
}

/* 
里面还可以继续递归
  this.root = {
    _raw:根模块,
    _children:{
      a:{
        _row:"a模块"，
         _children:{},
        state:"a的状态" 
      },
       b:{
        _row:"b模块"，
         _children:{},
        state:"b的状态" 
      }
    },
    state:"根模块自己的状态"
  }
*/
