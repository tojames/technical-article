/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type {FiberRoot, SuspenseHydrationCallbacks} from './ReactInternalTypes';
import type {RootTag} from './ReactRootTags';

import {noTimeout, supportsHydration} from './ReactFiberHostConfig';
import {createHostRootFiber} from './ReactFiber.old';
import {
  NoLanes,
  NoLanePriority,
  NoTimestamp,
  createLaneMap,
} from './ReactFiberLane';
import {
  enableSchedulerTracing,
  enableSuspenseCallback,
} from 'shared/ReactFeatureFlags';
import {unstable_getThreadID} from 'scheduler/tracing';
import {initializeUpdateQueue} from './ReactUpdateQueue.old';
import {LegacyRoot, BlockingRoot, ConcurrentRoot} from './ReactRootTags';

function FiberRootNode(containerInfo, tag, hydrate) {
  this.tag = tag; // 0
  this.hydrate = hydrate; // false
  this.containerInfo = containerInfo; //  <div id='root'></div>
  // The currently active root fiber. This is the mutable root of the tree.
  //当前应用root节点对应的Fiber对象，即Root Fiber，ReactElement会有一个树结构，同时一个ReactElement对应一个Fiber对象，所以Fiber也会有树结构
  this.pendingChildren = null; 
  this.current = null; // fiberNode，这里是第一个fiber的起点，即是app组件的父亲
  // WeakMap<Wakeable, Set<mixed>> | Map<Wakeable, Set<mixed>> | null,
  // 任务有三种，优先级有高低：
  // 1.没有提交的任务
  // 2.没有提交的被挂起的任务
  // 3.没有提交的可能被挂起的任务
  this.pingCache = null;
  // A finished work-in-progress HostRoot that's ready to be committed.
  // 已经完成任务的FiberRoot对象，如果你只有一个Root，那么该对象就是这个Root对应的Fiber或null
  // 在commit(提交)阶段只会处理该值对应的任务
  this.finishedWork = null;  
  // Timeout handle returned by setTimeout. Used to cancel a pending timeout, if it's superseded by a new one.
  // export const noTimeout = -1;
  // 在任务被挂起的时候，通过setTimeout设置的响应内容，
  // 并且清理之前挂起的任务 还没触发的timeout
  this.timeoutHandle = noTimeout;
  // 顶层context对象，只有主动调用renderSubtreeIntoContainer才会生效
  // context: Object | null,
  this.context = null;
  this.pendingContext = null; // 服务端相关
  // Node returned by Scheduler.scheduleCallback. Represents the next rendering
  // task that the root will work on.
  this.callbackNode = null;
  // 默认是最高级的回调函数
  this.callbackPriority = NoLanePriority;
  this.eventTimes = createLaneMap(NoLanes);
  this.expirationTimes = createLaneMap(NoTimestamp);

  // 这里的优先级全是最高级
  this.pendingLanes = NoLanes;
  this.suspendedLanes = NoLanes;
  this.pingedLanes = NoLanes;
  this.expiredLanes = NoLanes;
  this.mutableReadLanes = NoLanes;
  this.finishedLanes = NoLanes;

  this.entangledLanes = NoLanes;
  this.entanglements = createLaneMap(NoLanes);
  // 服务端相关
  if (supportsHydration) {
    this.mutableSourceEagerHydrationData = null;
  }

  // The following attributes are only used by interaction tracing builds.
  // They enable interactions to be associated with their async work,
  // And expose interaction metadata to the React DevTools Profiler plugin.
  // Note that these attributes are only defined when the enableSchedulerTracing flag is enabled.
  if (enableSchedulerTracing) {
    this.interactionThreadID = unstable_getThreadID();
    this.memoizedInteractions = new Set();
    this.pendingInteractionMap = new Map();
  }
  // false
  if (enableSuspenseCallback) {
    this.hydrationCallbacks = null;
  }

  // 在不同模式下会挂在不同的方法字符串
  if (__DEV__) {
    switch (tag) {
      case BlockingRoot:
        this._debugRootType = 'createBlockingRoot()';
        break;
      case ConcurrentRoot:
        this._debugRootType = 'createRoot()';
        break;
      case LegacyRoot:
        this._debugRootType = 'createLegacyRoot()';
        break;
    }
  }
}

export function createFiberRoot(
  containerInfo: any, // <div id='root'><div>
  tag: RootTag, // 0
  hydrate: boolean, // false
  hydrationCallbacks: null | SuspenseHydrationCallbacks, // null
): FiberRoot {
  // TODO: 创建FiberRootNode节点，
  const root: FiberRoot = (new FiberRootNode(containerInfo, tag, hydrate): any);
  // enableSuspenseCallback:false
  if (enableSuspenseCallback) {
    root.hydrationCallbacks = hydrationCallbacks;
  }

  // Cyclic construction. This cheats the type system right now because
  // stateNode is any.
  // 创建 FiberNode节点
  const uninitializedFiber = createHostRootFiber(tag);
  // 这里有一个循环引用
  root.current = uninitializedFiber;
  uninitializedFiber.stateNode = root;

  // 初始化更新链表
  initializeUpdateQueue(uninitializedFiber);

  return root;
}
