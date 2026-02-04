import React, { useState } from 'react'
import axios from 'axios'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

export default function RegPage() {
  const [step, setStep] = useState(1)
  const nav = useNavigate()

  const [username, setUsername] = useState('')
  const [first_name, setFirstName] = useState('')
  const [last_name, setLastName] = useState('')
  const [surname, setSurname] = useState('')
  const [email, setEmail] = useState('')
  const [phone_number, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [agreed, setAgreed] = useState(false)

  const [сode, setCode] = useState(null)
  const [userCode, setUserCode] = useState('')

  const strengthText = password.length === 0 ? '' : 
                       password.length < 6 ? 'Слабый' : 
                       password.length < 10 ? 'Средний' : 'Сильный'

  const reg = useMutation({
    mutationFn: (data) => axios.post('http://localhost:8000/api/auth/users/', data),
    onSuccess: (res) => {
      console.log(res.data);
      nav('/main'),
      alert('Аккаунт создан!')
    },
    onError: (err) => console.log(err.response?.data)
  });

  const nextStep1 = (e) => {
    e.preventDefault()
    if (password !== repeatPassword) return alert('Пароли не совпадают')
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    setCode(code)
    alert(`Код подтверждения: ${code}`)
    setStep(2)
  };

  const nextStep2 = (e) => {
    e.preventDefault()
    if (userCode === сode) setStep(3)
    else alert('Неверный код')
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault()
    reg.mutate({ email, password, username, first_name, last_name, surname, phone_number })
  };

  if (step === 1) return (
    <div style={{ padding: '20px' }}>
      <h3>Шаг 1: Доступ</h3>
      <form onSubmit={nextStep1}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required /><br/>
        <input type="text" placeholder="Логин" value={username} onChange={e => setUsername(e.target.value)} required /><br/>
        <input type="password" placeholder="Пароль" onChange={e => setPassword(e.target.value)} required />
        <div style={{ fontSize: '12px' }}>{strengthText}</div>
        <input type="password" placeholder="Повторите пароль" onChange={e => setRepeatPassword(e.target.value)} required /><br/>
        <button type="submit" disabled={password.length < 12}>Далее</button>
      </form>
    </div>
  );

  if (step === 2) return (
    <div style={{ padding: '20px' }}>
      <h3>Шаг 2: Подтверждение</h3>
      <p>Код отправлен на {email}</p>
      <form onSubmit={nextStep2}>
        <input type="text" placeholder="6-значный код" onChange={e => setUserCode(e.target.value)} required /><br/><br/>
        <button type="submit">Подтвердить</button>
        <button type="button" onClick={() => setStep(1)}>Назад</button>
      </form>
    </div>
  );

  if (step === 3) return (
    <div style={{ padding: '20px' }}>
      <h3>Шаг 3: О себе</h3>
      <form onSubmit={handleFinalSubmit}>
        <input type="text" placeholder="Фамилия" onChange={e => setFirstName(e.target.value)} required /><br/><br/>
        <input type="text" placeholder="Имя" onChange={e => setLastName(e.target.value)} required /><br/><br/>
        <input type="text" placeholder="Отчество" onChange={e => setSurname(e.target.value)} required /><br/><br/>
        <input type="text" placeholder="Телефон" onChange={e => setPhone(e.target.value)} required /><br/><br/>
        <label>
          <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
          Согласен на <a href="">обработку данных</a>
        </label><br/><br/>
        <button type="submit" disabled={!agreed || reg.isPending}>
          {reg.isPending ? 'Создание...' : 'Завершить регистрацию'}
        </button>
      </form>
    </div>
  )
}