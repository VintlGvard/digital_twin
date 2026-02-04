import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Navigate} from 'react-router-dom'
import { Routes } from 'react-router-dom'
import AuthPage from '../pages/AuthPage'
import RegPage from '../pages/RegPage'
import MainPage from '../pages/MainPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<AuthPage/>}/>
          <Route path='/register' element={<RegPage/>}/>
          <Route path='/main' element={<MainPage/>}/>
          <Route path='/' element={<Navigate to='/login'/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
