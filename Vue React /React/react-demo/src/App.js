import { useState } from "react"

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <div>
        <p>{count}</p>
      </div>

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
