import React, { useState, useEffect, useDebugValue } from 'react'
import ReactDOM from 'react-dom/client'

function Example2() {
  return (
    <div
      tabIndex={1}
      onFocus={(e) => {
        if (e.currentTarget === e.target) {
          console.log('focused self')
        } else {
          console.log('focused child', e.target)
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Not triggered when swapping focus between children
          console.log('focus entered self')
        }
      }}
      onBlur={(e) => {
        console.log(e)
        if (e.currentTarget === e.target) {
          console.log('unfocused self')
        } else {
          console.log('unfocused child', e.target)
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Not triggered when swapping focus between children
          console.log('focus left self')
        }
      }}
    >
      <input id="1" />
      <input id="2" />
    </div>
  )
}

function Example() {
  const [count, setCount] = useState({ count: 0 })
  const [count2, setCount2] = useState(0)
  // useEffect(() => {
  //   setInterval(() => {
  //     setCount2(count2 + 1)
  //   }, 1000)
  // })

  const fun1 = (e) => {
    console.log(e)
    setCount({ count: count.count + 1 })
  }
  const fun2 = () => {
    setCount2(count2 + 1)
    // count.count += 1
  }
  return (
    <div>
      <p>You clicked {count.count} times</p>
      <p>You clicked {count2} times</p>
      <button onClick={(e) => fun1(e)}>Click me</button>
      <button onClick={fun2}>Click me</button>
      <Example2></Example2>
    </div>
  )
}

function App() {
  return <Example />
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App />)
