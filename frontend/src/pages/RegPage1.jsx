import React, { useState } from 'react'
import axios from 'axios'
import { useMutation } from '@tanstack/react-query'

export default function Registration() {
  const [username, setUsername] = useState('')
  const [first_name, setFirstName] = useState('')
  const [last_name, setLastName] = useState('')
  const [surname, setSurname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [agreed, setAgreed] = useState(false)

  const strengthText = password.length === 0 ? '' : 
                       password.length < 6 ? 'Слабый' : 
                       password.length < 10 ? 'Средний' : 'Сильный';

  const reg = useMutation({
    mutationFn: (data) => axios.post('http://localhost:8000/api/auth/users/', data),
    onSuccess: () => alert('Готово!'),
    onError: () => alert('Ошибка')
  });

  const isInvalid = password !== repeatPassword && repeatPassword.length > 0;
  const canSubmit = agreed && password === repeatPassword && password.length >= 6 && !reg.isPending;

  return (
    <div style={{ padding: '20px' }}>
      <h3>Регистрация</h3>
      <form onSubmit={(e) => { e.preventDefault(); reg.mutate({ email, password }) }}>
        
        <div>
          <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required />
        </div>

        <br />

        <div>
          <input type="text" placeholder="Логин" onChange={e => setUsername(e.target.value)} required />
        </div>

        <br />

        <div>
          <input type="text" placeholder="Фамилия" onChange={e => setFirstName(e.target.value)} required />
        </div>

        <br />

        <div>
          <input type="text" placeholder="Имя" onChange={e => setLastName(e.target.value)} required />
        </div>

        <br />

        <div>
          <input type="text" placeholder="Отчество" onChange={e => setSurname(e.target.value)} required />
        </div>

        <br />

        <div>
          <input type="password" placeholder="Пароль" onChange={e => setPassword(e.target.value)} required />
          <div style={{ fontSize: '12px' }}>Сложность: {strengthText}</div>
        </div>

        <br />

        <div>
          <input type="password" placeholder="Подтвердите пароль" onChange={e => setRepeatPassword(e.target.value)} required />
          {isInvalid && <div style={{ color: 'red' }}>Пароли не совпадают</div>}
        </div>

        <br />

        <div>
          <label>
            <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
            Согласие на обработку данных
          </label>
        </div>

        <br />

        <button type="submit" disabled={!canSubmit}>
          {reg.isPending ? 'Отправка...' : 'Продолжить'}
        </button>
      </form>
    </div>
  )
}