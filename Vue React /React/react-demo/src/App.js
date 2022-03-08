import { useState } from "react"

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <h2> 这是子节点 </h2>
      <p>
        <span> 这是孙节点 </span>
      </p>
      <input
        type="button"
        value="增加"
        onClick={() => {
          setCount(count + 1)
        }}
      />
    </div>
  )
}
