# React应用TS

注意：对接口进行注释的时候 使用 /**/，// 不能被vscode识别

> 1.ReactElement 和ReactNode的区别。
>
> 2.函数组件中的props的参数太参数不理解的。

## 组件引入方式

### 函数组件

```tsx
React.FC是函数式组件，是在TypeScript使用的一个泛型。FC是FunctionComponent的缩写，React.FC可以写成React.FunctionComponent。

源码中：
type FC<P = {}> = FunctionComponent<P>;
interface FunctionComponent<P = {}> {
	(props: PropsWithChildren<P>, context?: any): ReactElement<any, any> | null; // 定义children
	propTypes?: WeakValidationMap<P> | undefined;
	contextTypes?: ValidationMap<any> | undefined;
	defaultProps?: Partial<P> | undefined;
	displayName?: string | undefined;
}
// 定义props children，是一个可选的ReactNode
type PropsWithChildren<P> = P & { children?: ReactNode | undefined };


使用：
interface ComponentProps {
  name: string;
}

const ComponentName: FC<ComponentProps> = (props) => {}
```

### 类组件

```tsx
import React, { Component } from 'react';

interface IProps {
  propName?: any;
}
interface IState {
  stateName: any;
}

class Index extends Component<IProps, IState> {
  // 构造函数
  constructor(props: IProps) {
    super(props);
    this.state = {
      stateName: 'stateName',
    };
  }
  render(): JSX.Element {
    return (
      <div>
        <div>{this.state.stateName}</div>
        <div>{this.props.propName}</div>
      </div>
    );
  }
}
export default Index;

```



## 事件注册

> 分为限制参数类型和事件方法的签名

### 事件参数类型

> 当我们注册事件的时候传递参数，总需要给参数定义一个类型，哪怕any。React提供了很多的事件参数类型，我们直接使用即可。

```tsx
ClipboardEvent<T = Element> 剪贴板事件对象
DragEvent<T = Element> 拖拽事件对象
ChangeEvent<T = Element>  Change 事件对象
KeyboardEvent<T = Element> 键盘事件对象
MouseEvent<T = Element> 鼠标事件对象
TouchEvent<T = Element>  触摸事件对象
WheelEvent<T = Element> 滚轮事件对象
AnimationEvent<T = Element> 动画事件对象
TransitionEvent<T = Element> 过渡事件对象

Element 主要是 HTMLInputElement、HTMLSelectElement

比如我以change 事件为例。
const handleChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
  // 如果是From表单 推荐使用React.FormEvent<HTMLInputElement>
  // dosomething
} 

也可以引入
import React, { ChangeEvent } from 'react';
const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  // dosomething
};

当我们的事件是有些特殊的时候，实在处理不了，可以使用any，不推荐。

技巧：把鼠标点击 onChange、onClick 悬浮在上面即可看见官方推荐的操作方法,接着把 Handler这个词删除就可以复制到我们限制参数类型上面了，这是因为React官方的方法和参数命名的好的原因。

如下：
(property) onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined
onChange?: ChangeEventHandler<T> | undefined;

复制这段 React.ChangeEvent<HTMLInputElement> | undefined


源码解析：`node_modules/@types/react/index.d.ts`
以change事件为例
interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
    target: EventTarget & T;
}

`node_modules/typescript/lib/lib.dom.d.ts`
React 定义了空接口，但是TS定义了有内容的东西，所以会合并。
declare var Element: {
    prototype: Element;
    new(): Element;
};

declare var Event: {
    prototype: Event;
    new(type: string, eventInitDict?: EventInit): Event;
    readonly AT_TARGET: number;
    readonly BUBBLING_PHASE: number;
    readonly CAPTURING_PHASE: number;
    readonly NONE: number;
};

/** EventTarget is a DOM interface implemented by objects that can receive events and may have listeners for them. */
interface EventTarget {
    /**
     * Appends an event listener for events whose type attribute value is type. The callback argument sets the callback that will be invoked when the event is dispatched.
     *
     * The options argument sets listener-specific options. For compatibility this can be a boolean, in which case the method behaves exactly as if the value was specified as options's capture.
     *
     * When set to true, options's capture prevents callback from being invoked when the event's eventPhase attribute value is BUBBLING_PHASE. When false (or not present), callback will not be invoked when event's eventPhase attribute value is CAPTURING_PHASE. Either way, callback will be invoked if event's eventPhase attribute value is AT_TARGET.
     *
     * When set to true, options's passive indicates that the callback will not cancel the event by invoking preventDefault(). This is used to enable performance optimizations described in § 2.8 Observing event listeners.
     *
     * When set to true, options's once indicates that the callback will only be invoked once after which the event listener will be removed.
     *
     * If an AbortSignal is passed for options's signal, then the event listener will be removed when signal is aborted.
     *
     * The event listener is appended to target's event listener list and is not appended if it has the same type, callback, and capture.
     */
    addEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: AddEventListenerOptions | boolean): void;
    /**
     * Dispatches a synthetic event event to target and returns true if either event's cancelable attribute value is false or its preventDefault() method was not invoked, and false otherwise.
     */
    dispatchEvent(event: Event): boolean;
    /**
     * Removes the event listener in target's event listener list with the same type, callback, and options.
     */
    removeEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: EventListenerOptions | boolean): void;
}

/**
 * currentTarget - a reference to the element on which the event listener is registered.
 *
 * target - a reference to the element from which the event was originally dispatched.
 * This might be a child element to the element on which the event listener is registered.
 * If you thought this should be `EventTarget & T`, see https://github.com/DefinitelyTyped/DefinitelyTyped/issues/11508#issuecomment-256045682
*/
interface SyntheticEvent<T = Element, E = Event> extends BaseSyntheticEvent<E, EventTarget & T, EventTarget> {}


interface BaseSyntheticEvent<E = object, C = any, T = any> {
    nativeEvent: E;
    currentTarget: C;
    target: T;
    bubbles: boolean;
    cancelable: boolean;
    defaultPrevented: boolean;
    eventPhase: number;
    isTrusted: boolean;
    preventDefault(): void;
    isDefaultPrevented(): boolean;
    stopPropagation(): void;
    isPropagationStopped(): boolean;
    persist(): void;
    timeStamp: number;
    type: string;
}

1.ChangeEvent 泛型接口接收了一个DOM「HTMLInputElement」参数，并且继承了泛型接口 SyntheticEvent<T>，自己也定义了 target: EventTarget & T; 触发事件的DOM元素定义为T
2.SyntheticEvent 接收了 DOM元素参数，它自己也定义了一个 E，然后又继承了泛型接口  BaseSyntheticEvent
3.BaseSyntheticEvent参数，E是Event接口，C是EventTarget和DOM元素的交叉，T是EventTarget，最后里面都是一些基础事件参数。

target 和 currentTarget 虽然定义的一致，但是目的不一样，target是页面点击触发的元素，currentTarget是注册js方法的元素。
```

### 事件方法

> 当我们封装组件的时候，我们也想对函数中的参数、返回值、做一些限制，React 也提供了一些Type来处理。

```tsx
//
// Event Handler Types
// ----------------------------------------------------------------------

type EventHandler<E extends SyntheticEvent<any>> = { bivarianceHack(event: E): void }["bivarianceHack"];
type ReactEventHandler<T = Element> = EventHandler<SyntheticEvent<T>>;
type ClipboardEventHandler<T = Element> = EventHandler<ClipboardEvent<T>>;
type CompositionEventHandler<T = Element> = EventHandler<CompositionEvent<T>>;
type DragEventHandler<T = Element> = EventHandler<DragEvent<T>>;
type FocusEventHandler<T = Element> = EventHandler<FocusEvent<T>>;
type FormEventHandler<T = Element> = EventHandler<FormEvent<T>>;
type ChangeEventHandler<T = Element> = EventHandler<ChangeEvent<T>>;
type KeyboardEventHandler<T = Element> = EventHandler<KeyboardEvent<T>>;
type MouseEventHandler<T = Element> = EventHandler<MouseEvent<T>>;
type TouchEventHandler<T = Element> = EventHandler<TouchEvent<T>>;
type PointerEventHandler<T = Element> = EventHandler<PointerEvent<T>>;
type UIEventHandler<T = Element> = EventHandler<UIEvent<T>>;
type WheelEventHandler<T = Element> = EventHandler<WheelEvent<T>>;
type AnimationEventHandler<T = Element> = EventHandler<AnimationEvent<T>>;
type TransitionEventHandler<T = Element> = EventHandler<TransitionEvent<T>>;

使用： 
interface CompoentProps {
  onClick : React.MouseEventHandler<HTMLDivElement>,
}

以MouseEventHandler为例。
1.MouseEventHandler<HTMLDivElement>，先去调用 MouseEvent<T>，得到返回值。
2.调用 EventHandler<E>,然后这个E已经是继承了MouseEvent的特有属性，又在这里继承了SyntheticEvent的属性，并且在event对象中做了限制MouseEventHandler的参数类型，就会去向上面`事件参数类型`那样去获取参数类型,这样就把整个事件的类型校验做完了。
```



## Hook

### useState

```tsx
//给定初始化值情况下可以直接使用

import { useState } from 'react';
const [val, toggle] = useState(false);
// val 被推断为 boolean 类型
// toggle 只能处理 boolean 类型


//没有初始值（undefined）或初始 null

type AppProps = { message: string };
const App = () => {
    const [data] = useState<AppProps | null>(null);✅ better
    return <div>{data?.message}</div>;
};
```

### useRef

```tsx
const ref1 = React.useRef<HTMLInputElement>(null)

const ref2 = React.useRef<HTMLInputElement | null>(null)
第一种方式的 ref1.current 是只读的（read-only），并且可以传递给内置的 ref 属性，绑定 DOM 元素 ；
第二种方式的 ref2.current 是可变的（类似于声明类的成员变量）

const onButtonClick = () => {
  ref1.current?.focus()
  ref2.current?.focus()
}
```

### **useMemo**

> 泛型指定了返回值类型

```tsx
const result = React.useMemo<string>(() => 2, [])

// 类型“() => number”的参数不能赋给类型“() => string”的参数。
```



### **useCallback**

> 泛型指定了参数类型

```
const handleChange = React.useCallback<React.ChangeEventHandler<HTMLInputElement>>(evt => {
  console.log(evt.target.value)
}, [])
```





## 常用React属性类型

```tsx
export declare interface AppBetterProps {
  children: React.ReactNode // 一般情况下推荐使用，支持所有类型 Great
  functionChildren: (name: string) => React.ReactNode
  style?: React.CSSProperties // 传递style对象
  onChange?: React.FormEventHandler<HTMLInputElement>
}

```

## 注意点

### 不要在type或interface中使用函数声明

```tsx
interface ICounter {
  start: (value: number) => string
  end(value: number): string // 推荐使用
}
```

参考

https://juejin.cn/post/6952696734078369828
