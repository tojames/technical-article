import { version, Component, useState, useEffect, useReducer, useMemo } from "react"

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
      {version}
      <Dialog></Dialog>
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

function Dialog() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    document.addEventListener("click", () => {
      setShow(false)
    })
  }, [])

  const handleButtonClick = (e) => {
    // stopPropagation 阻止向上冒泡，但不阻止本级的其他监听函数
    // 在 React16 设置此属性是不起作用的，因为这是一个合成事件，绑定在document上面
    // 在 React17 设置这个属性是可以的，因为这是一个合成事件，绑定在 root 上面，所以它阻止冒泡是可以防止document监听函数的
    // e.nativeEvent.stopPropagation()
    // 阻止向上冒泡，阻止本级的其他监听函数
    // 在React16、17 设置此属性都是可以的
    e.nativeEvent.stopImmediatePropagation()
    setShow(true)
  }

  return (
    <div>
      <button onClick={handleButtonClick}>显示</button>
      {show && (
        <div
          onClick={(e) => {
            e.nativeEvent.stopImmediatePropagation()
          }}
        >
          Model
        </div>
      )}
    </div>
  )
}
