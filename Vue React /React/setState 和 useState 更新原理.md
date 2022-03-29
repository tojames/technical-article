# setState 和 useState 更新原理



## setState

`/packages/react/src/ReactBaseClasses.js`

```tsx
// 当我们修改 state的时候将会调用 setState，里面又去调用了 enqueueSetState 方法。要讲清楚这个东西，首先要清楚 Component 的初始化流程。
Component.prototype.setState = function(partialState, callback) {
  this.updater.enqueueSetState(this, partialState, callback, 'setState');
};

// 初始化类组件
function Component(props, context, updater) {
  this.props = props;
  this.context = context;
  this.refs = emptyObject;
  this.updater = updater || ReactNoopUpdateQueue;
}
// 占坑的一个对象，用于不合法调用警告。
const ReactNoopUpdateQueue = {
  enqueueSetState: function(
    publicInstance,
    partialState,
    callback,
    callerName,
  ) {
    warnNoop(publicInstance, 'setState');
  },
};

// 当执行类组件构造函数的的时候，adoptClassInstance 函数将会被调用， 会把this.updater 重新赋值为真正的 updater
// instance：当前类组件，
function adoptClassInstance(workInProgress: Fiber, instance: any): void {
  instance.updater = classComponentUpdater;
}


const classComponentUpdater = {
  enqueueSetState(inst, payload, callback) {
    const fiber = getInstance(inst);
    const eventTime = requestEventTime();
    const lane = requestUpdateLane(fiber);

    const update = createUpdate(eventTime, lane);
    update.payload = payload;
		// 处理更新队列
    enqueueUpdate(fiber, update);
    // 调度 render阶段
    scheduleUpdateOnFiber(fiber, lane, eventTime);
  },
};

// 在render阶段中 执行 beginWork 遇见类组件的时候， /packages/react-reconciler/src/ReactFiberBeginWork.old.js 会去执行updateClassComponent方法，这个方法里面会去执行 updateClassInstance，接着还会去执行diff。
function updateClassInstance(
  current: Fiber,
  workInProgress: Fiber,
  ctor: any,
  newProps: any,
  renderLanes: Lanes,
): boolean {
	const instance = workInProgress.stateNode;
  processUpdateQueue(workInProgress, newProps, instance, renderLanes);
 }
```

## processUpdateQueue

```

```

