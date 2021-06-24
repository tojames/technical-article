import { forEachValue } from "../utils";
import Module from "./module";

export default class ModuleCollection {
  constructor(options) {
    // 递归处理数据

    this.register([], options); // statck = [根，子，孙]
  }
  register(path, rootModule) {
    // 格式化的结果
    let newModule = new Module(rootModule);

    if (path.length === 0) {
      // 根模块
      this.root = newModule;
    } else {
      // path.slice(0,-1) 把自己排除，找爷爷 爸爸
      let patent = path.slice(0, -1).reduce((memo, current) => {
        // return memo._children[current];
        return memo.getChild[current];
      }, this.root);

      newModule.addChild(path[path.length - 1], newModule);
      // patent._children[path[path.length - 1]] = newModule;
      console.log(patent, "patent");
    }

    if (rootModule.modules) {
      forEachValue(rootModule.modules, (module, moduleName) => {
        // [a]
        // [b]
        this.register([...path, ...moduleName], module);
      });
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
