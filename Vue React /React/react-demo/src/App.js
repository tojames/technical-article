import { useState } from "react"

export default function App() {
  const [count, setCount] = useState(0)
  // debugger
  // console.log("APP")
  const handleCount = () => {
    setCount(count + 1)
    setCount(2)
    setCount(3)
  }
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
