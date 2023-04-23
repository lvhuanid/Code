import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import T from './pages/T'
import T0 from './pages/T0'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <T0 />
    </>
  )
}

export default App
