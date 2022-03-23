# React 事件系统

在 `completeWork` 方法中，做了其中的一件事是给 DOM 节点设置属性（finalizeInitialChildren），正是事件系统的起始点。

`/packages/react-dom/src/client/ReactDOMHostConfig.js`

```tsx
export function finalizeInitialChildren(domElement: Instance,type: string,props: Props, rootContainerInstance: Container, hostContext: HostContext): boolean {
  // domElement: dom 节点
  // type：标签类型
  // rootContainerInstance： <div id='root'> ... </div>
  setInitialProperties(domElement, type, props, rootContainerInstance);
  return shouldAutoFocusHostComponent(type, props);
}
```

# React16

![image-20220323073313796](images/image-20220323073313796.png)



![image-20220323073348917](images/image-20220323073348917.png)

![image-20220323073643222](images/image-20220323073643222.png)



![image-20220323073805027](images/image-20220323073805027.png)

![image-20220323073846971](images/image-20220323073846971.png)

![image-20220323074600812](images/image-20220323074600812.png)

# React 17

![image-20220323075635442](images/image-20220323075635442.png)

![image-20220323075739633](images/image-20220323075739633.png)

![image-20220323075939694](images/image-20220323075939694.png)

![image-20220323080552568](images/image-20220323080552568.png)

案例

![image-20220323080617116](images/image-20220323080617116.png)

![image-20220323081423402](images/image-20220323081423402.png)
