import { useState } from 'react'
import './App.css'
import RegPage1 from '../pages/RegPage1'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <RegPage1/>
    </>
  )
}

export default App
