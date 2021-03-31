export default {
  namespace: "products",
  state: {
    produstList: [
      { name: "iwatche6", value: 3000, id: 1 },
      { name: "小米手环6", value: 300, id: 2 },
    ],
  },
  reducers: {
    delete(state, { payload: id }) {
      let oldState = JSON.parse(JSON.stringify(state));
      oldState.produstList = state.produstList.filter((item) => item.id !== id);
      return oldState;
    },
    add(state, { payload: data }) {
      let oldState = JSON.parse(JSON.stringify(state));
      oldState.produstList = [...oldState.produstList, data];
      return oldState;
    },
  },

  effects: {
    *addAsync({ payload: data }, { put, call }) {
      yield put({
        type: "add",
        payload: data,
      });
      console.log("run");
    },
    *addAsync2({ payload }, { put, call }) {
      let res = yield call(func); // 调用 func函数，这里的func可以是异步的操作
      yield put({
        type: "add",
        payload: res,
      });
    },
  },
};

let func = () => {
  let product = { name: "小米汽车", value: 100000, id: 6 };
  return product;
};
