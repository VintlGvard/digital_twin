import React, { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import {loginUser} from '../api'

function LoginPage() {
  const [step, setStep] = useState(1)
  const [creds, setCreds] = useState({email: '', password: ''})
  const navigate = useNavigate()

  const handler = async(e) => {
    e.preventDefault()
    try{
      const res = await loginUser(creds.email, creds.password)
      localStorage.setItem('token', res.data.access)
      setStep(2)
    } catch(err) {
      alert("Ошибка входа")
    }
  }

  const checkCaptcha = (isCorrect) => {
    if (isCorrect) {
      navigate('/dashboard')
    } else {
      alert('Неверно')
      setStep(1)
    }
  }

  return (
    <>
    <div>
      <div>
        <h2>Врачебный кабинет - Авторизация</h2>
        {step === 1 ? (
          <form onSubmit={handler}>
            <input type="text" placeholder='Email' value={creds.email} onChange={e => setCreds({...creds, email: e.target.value})} />
            <input type="text" placeholder='Пароль' value={creds.password} onChange={e => setCreds({...creds, password: e.target.value})} />
            <button type='submit'>Войти</button>
          </form>
        ) : (
          <div>
            <h3>Капча</h3>
            <p>Пациент 65 лет, АД 170/100. Ваши действия?</p>
            <button onClick={() => checkCaptcha(false)}>Ввести адреналин</button>
            <button onClick={() => checkCaptcha(true)}>Дать Каптоприл</button>
            <button onClick={() => checkCaptcha(false)}>Отправить домой</button>
          </div>
        )}
      </div>
    </div>
    </>
  )
}

export default LoginPage