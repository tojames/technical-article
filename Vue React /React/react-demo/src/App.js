import { version, Component, useState, useEffect, useReducer, useMemo } from "react"

export default function App() {
  const handleCount = (e) => {
    setCount((count) => count + 1)
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
      <button onClick={handleCount}> 按钮 </button>
      {/* <p>
        <span> 这是孙节点 </span>
      </p>
      <div>{count}</div>
      <input type="button" value="增加" onClick={handleCount} />
      <hr /> */}
      <TestClass></TestClass>
      {/* <ul>
        <li>{count + 1}---1</li>
        <li>{count + 2}---2</li>
        <li>{count + 3}---3</li>
        <li>{count + 4}---4</li>
        <li>{count + 5}---5</li>
      </ul> */}
    </div>
  )
}

class TestClass extends Component {
  state = { name: "TestClass" }
  changeState = () => {
    this.setState({ name: "newTestClass" })
  }
  render() {
    return <div onClick={this.changeState}>我是类组件--{this.state.name}</div>
  }
}

// const TestFn = () => {
//   return <div>我是类组件</div>
// }

// function Dialog() {
//   const [show, setShow] = useState(false)
//   useEffect(() => {
//     document.addEventListener("click", () => {
//       setShow(false)
//     })
//   }, [])

//   const handleButtonClick = (e) => {
//     // stopPropagation 阻止向上冒泡，但不阻止本级的其他监听函数
//     // 在 React16 设置此属性是不起作用的，因为这是一个合成事件，绑定在document上面
//     // 在 React17 设置这个属性是可以的，因为这是一个合成事件，绑定在 root 上面，所以它阻止冒泡是可以防止document监听函数的
//     // e.nativeEvent.stopPropagation()
//     // 阻止向上冒泡，阻止本级的其他监听函数
//     // 在React16、17 设置此属性都是可以的
//     e.nativeEvent.stopImmediatePropagation()
//     setShow(true)
//   }

//   return (
//     <div>
//       <button onClick={handleButtonClick}>显示</button>
//       {show && (
//         <div
//           onClick={(e) => {
//             e.nativeEvent.stopImmediatePropagation()
//           }}
//         >
//           Model
//         </div>
//       )}
//     </div>
//   )
// }
