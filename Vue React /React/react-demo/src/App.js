import { Component, useState, useEffect, useReducer, useMemo } from "react"

export default function App() {
  const handleCount = (e) => {
    console.log(e.nativeEvent, "nativeEvent")
  }

  const [count, setCount] = useState(1)
  // useEffect(() => {
  //   console.log("useEffect")
  //   return () => {
  //     console.log("destory")
  //   }
  // }, [count])
  // useEffect(() => {
  //   console.log("useEffect2")
  // }, [])
  useEffect(() => {
    console.log("useEffect3")
  }, [])

  return (
    <div>
      <h2> 这是子节点 </h2>
      <p>
        <span> 这是孙节点 </span>
      </p>
      <div>{count}</div>
      {/* <div>count3 : {count3State.count}</div> */}
      <input type="button" value="增加" onClick={handleCount} />
      <hr />
    </div>
  )
}

// class TestClass extends Component {
//   render() {
//     return <div>我是类组件</div>
//   }
// }

// const TestFn = () => {
//   return <div>我是类组件</div>
// }
