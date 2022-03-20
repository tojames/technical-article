import { useState, useEffect, useReducer, useMemo } from "react"

function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 }
    case "decrement":
      return { count: state.count - 1 }
    default:
      throw new Error()
  }
}

export default function App() {
  // const [count2, setCount2] = useState(2)
  // debugger
  // const [count3State, setCount3] = useReducer(reducer, { count: 0 })
  const handleCount = () => {
    // debugger
    setCount((count) => count + 1)
    // setCount((count) => count + 2)
    // setCount((count) => count + 3)
    // setCount2("第1次赋值")
    // setCount2("第2次赋值")
    // setCount2("第3次赋值")
    // setCount3({ type: "increment" })
  }

  const [count, setCount] = useState(1)
  const memo = useMemo(() => count + 1, [])
  // useEffect(() => {
  //   console.log("useEffect")
  //   return () => {
  //     console.log("destory")
  //   }
  // }, [count])
  // useEffect(() => {
  //   console.log("useEffect2")
  // }, [])
  // useEffect(() => {
  //   console.log("useEffect3")
  // }, [])

  return (
    <div>
      <h2> 这是子节点 </h2>
      <p>
        <span> 这是孙节点 </span>
      </p>
      <div>{count}</div>
      <div>memo：{memo}</div>
      {/* <div>count3 : {count3State.count}</div> */}
      <input type="button" value="增加" onClick={handleCount} />
    </div>
  )
}
