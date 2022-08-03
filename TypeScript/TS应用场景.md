# TS应用场景

## 通用的工具类

```TS
// 通过展开内容，可以看见返回值内容
type MyPattern<T> = {
  [P in keyof T]: T[P]
}
```



## Axios 如何应用TS

```ts
interface IRes<TData = unknown> {
  code: number;
  error?: string;
  data: TData;
}


interface IUserProfileRes {
  name: string;
  homepage: string;
  avatar: string;
}

function fetchUserProfile(): Promise<IRes<IUserProfileRes>> {}

type StatusSucceed = boolean;
function handleOperation(): Promise<IRes<StatusSucceed>> {}


interface IPaginationRes<TItem = unknown> {
  data: TItem[];
  page: number;
  totalCount: number;
  hasNextPage: boolean;
}
在这里可以向接口提供方提出规范。比如是分页则提出分页的标准，是普通的接口就有普通接口的标准，返回成功或者失败的标准

function fetchUserProfileList(): Promise<IRes<IPaginationRes<IUserProfileRes>>> {}
```



## 新增和编辑属性不一致如何兼容处理

方法一：

```ts
// 所有需要提交的数据
interface Params {
  id: string
  name: string
  age: number
}
// 新增需要提交的数据
type AddParams = MyPattern<Omit<Params, "id" | "age">>

const add: AddParams = {
  name: "1",
}

// 编辑需要提交的数据
const edit: Params = {
  id: "id",
  name: "name",
  age: 1,
}

```

方法二：

```ts
type ParamsConditional<IsEdit extends "Edit" | "Add"> = IsEdit extends "Edit" ? Params : AddParams

interface Params {
  id: string
  name: string
  age: number
}

type AddParams = MyPattern<Omit<Params, "id" | "age">>

const add: ParamsConditional<"Add"> = {
  name: "1",
}

const edit: ParamsConditional<"Edit"> = {
  id: "id",
  name: "name",
  age: 1,
}

```

