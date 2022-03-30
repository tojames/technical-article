# setState 和 useState 更新原理

本篇文章依据的版本是 React：V17.0 +

我看见现在网上很多都是讲解 React 16,15 的，因为改版太多思路不在复用。老版本的逻辑大概是，有一把“锁”—— `isBatchingUpdates 全局变量`，`isBatchingUpdates` 的初始值是 false。每当 React 调用 batchedUpdate 去执行更新动作时，会先把这个锁给“锁上”（置为 true），表明“现在正处于批量更新过程中”。当锁被“锁上”的时候，任何需要更新的组件都只能暂时进入 dirtyComponents 里排队等候下一次的批量更新，而不能随意“插队”。

React：V17.0 +  完全不一样，以下见分晓。

## setState



```tsx
// 当我们修改 state的时候将会调用 setState，里面又去调用了 enqueueSetState 方法。要讲清楚这个东西，首先要清楚 Component 的初始化流程。
// /packages/react/src/ReactBaseClasses.js
Component.prototype.setState = function(partialState, callback) {
  this.updater.enqueueSetState(this, partialState, callback, 'setState');
};

// 初始化类组件
function Component(props, context, updater) {
  this.props = props;
  this.context = context;
  this.refs = emptyObject;
  // 当 updater不存在的时候，这里是赋值 ReactNoopUpdateQueue 对象，它是打酱油的，用于在不合法调用的时候报一些警告出来。
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

// 运行阶段
// 当类组件执行构造函数的的时候，adoptClassInstance 函数将会被调用，会把this.updater 重新赋值为真正的 updater
// instance：当前类组件，
// /packages/react-reconciler/src/ReactFiberClassComponent.old.js
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

// 触发阶段
// 当用户触发了更新setState就会去调用 enqueueSetState，由 scheduleUpdateOnFiber 这个方法进入 render阶段。在render阶段中，执行 beginWork 遇见类组件的时候，会去执行updateClassComponent方法，这个方法里面会去执行 updateClassInstance 「重点」，接着还会去执行diff。
// /packages/react-reconciler/src/ReactFiberBeginWork.old.js
function updateClassInstance(
  current: Fiber,
  workInProgress: Fiber,
  ctor: any,
  newProps: any,
  renderLanes: Lanes,
): boolean {
	const instance = workInProgress.stateNode;
  // 这个方法重点理解，是整个更新的比较重要的处理，会有大量的链表操作 
  processUpdateQueue(workInProgress, newProps, instance, renderLanes);
 }
```

## processUpdateQueue

/packages/react-reconciler/src/ReactUpdateQueue.old.js

官网对这段代码的解析。

```tsx
前提：要开启 concurrent 模式，如果不开启的话，是默认都是最高优先级，就会按照运行下去，
ReactDOM.unstable_createRoot(document.getElementById("root")).render(<App />)

/*
UpdateQueue is a linked list of prioritized updates.

Like fibers, update queues come in pairs: a current queue, which represents
the visible state of the screen, and a work-in-progress queue, which can be
mutated and processed asynchronously before it is committed — a form of
double buffering. If a work-in-progress render is discarded before finishing,
we create a new work-in-progress by cloning the current queue.

Both queues share a persistent, singly-linked list structure. To schedule an
update, we append it to the end of both queues. Each queue maintains a
pointer to first update in the persistent list that hasn't been processed.
The work-in-progress pointer always has a position equal to or greater than
the current queue, since we always work on that one. The current queue's
pointer is only updated during the commit phase, when we swap in the
work-in-progress.

For example:

  Current pointer:           A - B - C - D - E - F
  Work-in-progress pointer:              D - E - F
                                         ^
                                         The work-in-progress queue has
                                         processed more updates than current.
react 它会保持 current节点 和 workInProgress节点 的更新列表一致，这样下次更新的话就不会丢失。
The reason we append to both queues is because otherwise we might drop
updates without ever processing them. For example, if we only add updates to
the work-in-progress queue, some updates could be lost whenever a work-in
-progress render restarts by cloning from current. Similarly, if we only add
updates to the current queue, the updates will be lost whenever an already
in-progress queue commits and swaps with the current queue. However, by
adding to both queues, we guarantee that the update will be part of the next
work-in-progress. (And because the work-in-progress queue becomes the
current queue once it commits, there's no danger of applying the same
update twice.)

Prioritization
--------------

Updates are not sorted by priority, but by insertion; new updates are always
appended to the end of the list.

The priority is still important, though. When processing the update queue
during the render phase, only the updates with sufficient priority are
included in the result. If we skip an update because it has insufficient
priority, it remains in the queue to be processed later, during a lower
priority render. Crucially, all updates subsequent to a skipped update also
remain in the queue *regardless of their priority*. That means high priority
updates are sometimes processed twice, at two separate priorities. We also
keep track of a base state, that represents the state before the first
update in the queue is applied.

For example:

  Given a base state of '', and the following queue of updates

    A1 - B2 - C1 - D2

  where the number indicates the priority, and the update is applied to the
  previous state by appending a letter, React will process these updates as
  two separate renders, one per distinct priority level:

  First render, at priority 1:
    Base state: ''
    Updates: [A1, C1]
    Result state: 'AC'

  Second render, at priority 2:
    Base state: 'A'            <-  The base state does not include C1,
                                   because B2 was skipped.
    Updates: [B2, C1, D2]      <-  C1 was rebased on top of B2
    Result state: 'ABCD'

Because we process updates in insertion order, and rebase high priority
updates when preceding updates are skipped, the final result is deterministic
regardless of priority. Intermediate state may vary according to system
resources, but the final state is always the same.

*/
```



```tsx
// 处理更新的核心链表
export function processUpdateQueue<State>(workInProgress: Fiber,props: any,instance: any,renderLanes: Lanes): void {
  // This is always non-null on a ClassComponent or HostRoot
  // 从workInProgress节点上取出updateQueue
  const queue: UpdateQueue<State> = (workInProgress.updateQueue: any);

  hasForceUpdate = false;

  if (__DEV__) {
    currentlyProcessingQueue = queue.shared;
  }

  // 上次更新遗留的开始位置的链表，优先级较低
  let firstBaseUpdate = queue.firstBaseUpdate;
  // 上次更新遗留的结束位置的链表
  let lastBaseUpdate = queue.lastBaseUpdate;

  // Check if there are pending updates. If so, transfer them to the base queue.
  // 新的更新链表
  let pendingQueue = queue.shared.pending;
  // 取出链表后，清空链表
  if (pendingQueue !== null) {
    // 清空当前 queud 中更新的内容，因为已经取出来了。
    queue.shared.pending = null;

    // The pending queue is circular. Disconnect the pointer between first
    // and last so that it's non-circular.
    // 拿到新链表
    const lastPendingUpdate = pendingQueue;
    const firstPendingUpdate = lastPendingUpdate.next;
    // 断开链表，这样就不再是循环链表
    lastPendingUpdate.next = null;
    // Append pending updates to base queue
    // 拼接链表，将新的链表拼接在旧的后面
    if (lastBaseUpdate === null) {
      firstBaseUpdate = firstPendingUpdate;
    } else {
      lastBaseUpdate.next = firstPendingUpdate;
    }
    // 重置为链表最后的一个链表
    lastBaseUpdate = lastPendingUpdate;

    // If there's a current queue, and it's different from the base queue, then
    // we need to transfer the updates to that queue, too. Because the base
    // queue is a singly-linked list with no cycles, we can append to both
    // lists and take advantage of structural sharing.
    // TODO: Pass `current` as argument
    // 用同样的方式更新current上的firstBaseUpdate 和
    // lastBaseUpdate（baseUpdate队列）。
    // 这样做相当于将本次合并完成的队列作为baseUpdate队列备份到current节
    // 点上，因为如果本次的渲染被打断，那么下次再重新执行任务的时候，workInProgress节点复制
    // 自current节点，它上面的baseUpdate队列会保有这次的update，保证update不丢失。
    const current = workInProgress.alternate;
    if (current !== null) {
      // This is always non-null on a ClassComponent or HostRoot
      const currentQueue: UpdateQueue<State> = (current.updateQueue: any);
      const currentLastBaseUpdate = currentQueue.lastBaseUpdate;
      if (currentLastBaseUpdate !== lastBaseUpdate) {
        if (currentLastBaseUpdate === null) {
          currentQueue.firstBaseUpdate = firstPendingUpdate;
        } else {
          currentLastBaseUpdate.next = firstPendingUpdate;
        }
        currentQueue.lastBaseUpdate = lastPendingUpdate;
      }
    }
  }

  // These values may change as we process the queue.
  // firstBaseUpdate 作为新旧已经合并的链表的第一个项
  if (firstBaseUpdate !== null) {
    // Iterate through the list of updates to compute the result.
    // 取出上次计算后的baseState
    let newState = queue.baseState;
    // TODO: Don't need to accumulate this. Instead, we can remove renderLanes
    // from the original lanes.
    // 重新定义优先级
    let newLanes = NoLanes;

    let newBaseState = null;
    let newFirstBaseUpdate = null;
    let newLastBaseUpdate = null;

    let update = firstBaseUpdate;
    do {
      const updateLane = update.lane;
      const updateEventTime = update.eventTime;
      // isSubsetOfLanes：判断当前更新的优先级（updateLane）
      // 是否在渲染优先级（renderLanes）中如果不在，说明优先级不足
      if (!isSubsetOfLanes(renderLanes, updateLane)) {
        // 优先级不足
        // Priority is insufficient. Skip this update. If this is the first
        // skipped update, the previous update/state is the new base
        // update/state.
        const clone: Update<State> = {
          eventTime: updateEventTime,
          lane: updateLane,

          tag: update.tag,
          payload: update.payload,
          callback: update.callback,

          next: null,
        };
        // 将优先级不足的项拼接成一个新的链表
        if (newLastBaseUpdate === null) {
          newFirstBaseUpdate = newLastBaseUpdate = clone;
          // 这个newState就是这次更新已经处理的了符合优先级的update，当它遇到了不符合优先级的时候就赋值到这里了。
          newBaseState = newState;
        } else {
          // 拼接其他的不符合优先级的
          newLastBaseUpdate = newLastBaseUpdate.next = clone;
        }
        // Update the remaining priority in the queue.
        /* *
          * newLanes会在最后被赋值到workInProgress.lanes上，而它又最终
          * 会被收集到root.pendingLanes。
          *  再次更新时会从root上的pendingLanes中找出渲染优先级（renderLanes），
          * renderLanes含有本次跳过的优先级，再次进入processUpdateQueue时，
          * update的优先级符合要求，被更新掉，低优先级任务因此被重做
        * */
        newLanes = mergeLanes(newLanes, updateLane);
      } else {
        // This update does have sufficient priority.
        // 有足够优先级
        // newLastBaseUpdate !== null 说明已经存在 低优先级任务了，后面的高优先级任务需要拼接起来。
        if (newLastBaseUpdate !== null) {
          const clone: Update<State> = {
            eventTime: updateEventTime,
            // This update is going to be committed so we never want uncommit
            // it. Using NoLane works because 0 is a subset of all bitmasks, so
            // this will never be skipped by the check above.
            lane: NoLane,

            tag: update.tag,
            payload: update.payload,
            callback: update.callback,

            next: null,
          };
          newLastBaseUpdate = newLastBaseUpdate.next = clone;
        }

        // Process this update.
        // 上面的优先级拼接完成了，这里高优先级的任务仍然需要继续计算
        newState = getStateFromUpdate(workInProgress,queue,update,newState,props,instance );
        const callback = update.callback;
        // 将更新对象 放在副作用，在commit 阶段的时候进行更新
        if (callback !== null) {
          workInProgress.flags |= Callback;
          const effects = queue.effects;
          if (effects === null) {
            queue.effects = [update];
          } else {
            effects.push(update);
          }
        }
      }
      update = update.next;
      // 当前的链表已经处理完毕了
      if (update === null) {
        // 检查一下有没有新进来的链表，如果有继续遍历
        pendingQueue = queue.shared.pending;
        if (pendingQueue === null) {
          // 没有就可以 break
          break;
        } else {
          // 和上面拼接的逻辑是一致的，继续遍历下去
          // An update was scheduled from inside a reducer. Add the new
          // pending updates to the end of the list and keep processing.
          const lastPendingUpdate = pendingQueue;
          // Intentionally unsound. Pending updates form a circular list, but we
          // unravel them when transferring them to the base queue.
          const firstPendingUpdate = ((lastPendingUpdate.next: any): Update<State>);
          lastPendingUpdate.next = null;
          update = firstPendingUpdate;
          queue.lastBaseUpdate = lastPendingUpdate;
          queue.shared.pending = null;
        }
      }
    } while (true);

    // 所有的链表更新完了，才会赋值最终计算的值，否则都是返回，被跳过的值
    if (newLastBaseUpdate === null) {
      newBaseState = newState;
    }
    // 将处理好的 state 和  newFirstBaseUpdate 、 newLastBaseUpdate 进行赋值吗
    queue.baseState = ((newBaseState: any): State);
    queue.firstBaseUpdate = newFirstBaseUpdate;
    queue.lastBaseUpdate = newLastBaseUpdate;

    // Set the remaining expiration time to be whatever is remaining in the queue.
    // This should be fine because the only two other things that contribute to
    // expiration time are props and context. We're already in the middle of the
    // begin phase by the time we start processing the queue, so we've already
    // dealt with the props. Context in components that specify
    // shouldComponentUpdate is tricky; but we'll have to account for
    // that regardless.
    markSkippedUpdateLanes(newLanes);
    workInProgress.lanes = newLanes;
    workInProgress.memoizedState = newState;
  }
}
```

