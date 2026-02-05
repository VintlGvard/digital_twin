import { useState } from 'react'
import './App.css'
import {HashRouter, Routes, Route} from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/DashboardPage'
import PatientDetails from './pages/PatientDetailsPage'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path='/' element={<LoginPage/>} />
        <Route path='/dashboard' element={<Dashboard/>} />
        <Route path="/patient/:id" element={<PatientDetails />} />
      </Routes>
    </HashRouter>
  )
}

export default App
