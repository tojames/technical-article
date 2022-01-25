# React应用TS

# React中使用TS

## 事件相关

```tsx
// click 使用 React.MouseEvent 加 dom 类型的泛型
// HTMLInputElement 代表 input标签 另外一个常用的是 HTMLDivElement
const onClick = (e: React.MouseEvent<HTMLInputElement>) => {};
// onChange使用 React.ChangeEvent 加 dom 类型的泛型
// 一般都是 HTMLInputElement,HTMLSelectElement 可能也会使用
const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {};

如果是form表单中的 onChange不一样。
const onChange = (e: React.FormEvent<HTMLInputElement>) = {};
```

