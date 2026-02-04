import React, { useEffect } from 'react'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

function MainPage() {
  const token = localStorage.getItem('token')
  const nav = useNavigate()

  useEffect(() => {
    if (!token) {
      nav('/login')
    }
  }, [token, nav])

  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:8000/api/auth/users/', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const [result] = res.data
      return result
    },
    enabled: !!token,
    retry: false
  })

  if (isLoading) return <div>Загрузка профиля...</div>

  if (isError) {
    return (
      <div>
        <p>Ошибка авторизации или сессия истекла</p>
        <button onClick={() => { 
          localStorage.clear()
          nav('/login') 
        }}>
          Войти заново
        </button>
      </div>
    )
  }

  return (
    <div>
      <h2>Добрый день, {user?.first_name || 'Пользователь'}!</h2>

      <div>
        <h3>Сводка за сегодня:</h3>
        <p>Последние показатели Глюкоза: <b>5.6</b>, Давление: <b>120/80</b></p>
        <p>Активные назначения: <b>3</b> препарата</p>
      </div>

      <button onClick={() => { localStorage.clear(); nav('/login') }}>
        Выйти из системы
      </button>
    </div>
  )
}

export default MainPage