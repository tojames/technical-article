import { useState } from "react"

export default function App() {
  const [count, setCount] = useState(1)
  const [count2, setCount2] = useState(2)
  // debugger
  // console.log("APP")
  const handleCount = () => {
    // debugger
    setCount((count) => count + 1)
    setCount((count) => count + 2)
    setCount((count) => count + 3)
    setCount2("第1次赋值")
    setCount2("第2次赋值")
    setCount2("第3次赋值")
  }
  // console.log(React, "React")
  return (
    <div>
      <h2> 这是子节点 </h2>
      <p>
        <span> 这是孙节点 </span>
      </p>
      <div>{count}</div>
      <input type="button" value="增加" onClick={handleCount} />
    </div>
  )
}
