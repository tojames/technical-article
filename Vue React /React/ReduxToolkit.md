```ts
/**
 * example： 页面存值，取值
 *
 * import { useDispatch, useSelector } from 'react-redux';
 *
 * 存值
 * const dispatch = useDispatch();
 * dispatch( setTest(params));
 *
 * 取值
 * const { test } = useSelector(({ user }: { user: UserState }) => user);
 * useSelector 回调函数第一个参数是store中所有的state对象，{ user } 将 user 解构出来，{ user: UserState } 是对 user 进行类型注解
 *
 *
 * createAsyncThunk：接受异步的代码逻辑，将结果存入store
 *
 * 声明
 * export const testFn = createAsyncThunk<Record<string, any>, { params: string }>(
  'test/test',
  async (params, { dispatch, getState }) => {
    console.log('异步执行的逻辑', params);
    console.log('getState', getState());
    dispatch(setTest(params));
    return {
      hello: 'hello'
    };
  }
);

Record<string, any>:testFn的返回值
{ params: string }: 外部调用testFn传进来的参数
createAsyncThunk 第一个参数「'test/test'」，随便写，但是为了规范，第二个参数是一个对象 包含 dispatch，getState

// 当前面的逻辑走完后，最后会走下面的逻辑
extraReducers(builder) {
    // 测试方法
    builder.addCase(testFn.pending, (state) => {
      console.log('extraReducers test-pending', state);
    });
    builder.addCase(testFn.fulfilled, (state, action) => {
      console.log('extraReducers test-fulfilled', state, action);
    });
    builder.addCase(testFn.rejected, (state) => {
      console.log('extraReducers test-rejected', state);
    });
  }

调用   dispatch(testFn({ params: '123' }));


 */
```

