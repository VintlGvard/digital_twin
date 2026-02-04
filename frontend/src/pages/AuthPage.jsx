import React, {useState, useEffect} from 'react'
import axios from "axios"
import {useMutation} from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)

  const nav = useNavigate()

  const [steps, setSteps] = useState([
    {id: '3', txt: 'Принять таблетку'},
    {id: '4', txt: 'Запить водой'},
    {id: '2', txt: 'Зафиксировать результат'},
    {id: '1', txt: 'Измерить давление'},
  ])

  const IsVerified = steps.map(s=>s.id).join('') === '1234'

  const login = useMutation({
    mutationFn: (data) => axios.post('http://127.0.0.1:8000/api/auth/jwt/create/', data),
    onSuccess: (res) => {
      localStorage.setItem('token', res.data.access)
      alert('Вход выполнен')
    },
    onError: () => alert('Ошибка! Проверь данные')
  })

  const move = (i) => {
    const arr = [...steps]
    arr.push(arr.splice(i, 1)[0])
    setSteps(arr)
  }


  return (
    <div>
      <h4>Вход</h4>

      <form onSubmit={(e) => {e.preventDefault(); login.mutate({email, password})}}>
        <div>
          <input type="email" placeholder='Email @' className='form-control' value={email} onChange={e => setEmail(e.target.value)} />
        </div>

        <div>
          <input type={showPass ? 'text' : "password"} className='form-control' placeholder='password' value={password} onChange={e => setPassword(e.target.value)}/>
          <button type='button' onClick={() => setShowPass(!showPass)}>
            {showPass ? 'Скрыть' : "Показать"}
          </button>
        </div>

        <div>
          <div>Выстройте порядок</div>
          {steps.map((s, i) => (
            <div key={s.id} onClick={() => move(i)}>
              {i+1}. {s.txt}
            </div>
          ))}
        </div>

        <button disabled={!IsVerified || login.isPending}>
          {login.isPending ? 'Вход...' : 'Войти'}
        </button>
      </form>

      <div>
        <a href="" onClick={() => nav('/register')}>Зарегистрироваться</a>
        <br />
        <a href="">Забыли пароль?</a>
      </div>
    </div>
  )
}

export default AuthPage