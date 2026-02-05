import React, { useEffect, useState } from 'react'
import { getPatients, getMe, createAppointment, getDoctorAppointments } from '../api'
import { useNavigate } from 'react-router-dom'

export default function DashboardPage() {
  const [patients, setPatients] = useState([])
  const [appointments, setAppointments] = useState([])
  const [doctor, setDoctor] = useState(null)

  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    medical_record: '',
    data_time: '',
    reason: '',
    doctor: '' 
  })

  const [alerts, setAlerts] = useState([
    { id: 1, text: 'Иванов И.И.: Глюкоза 15 ммоль/л (Критично)', type: 'critical' },
    { id: 2, text: 'Петров А.А.: Пропущен плановый осмотр', type: 'warning' }
  ])

  const navigate = useNavigate()

  useEffect(() => {
    loadData()

    const timeout = setTimeout(() => {
        localStorage.removeItem('token')
        navigate('/')
    }, 600000)

    return () => clearTimeout(timeout)
  }, [])

  const loadData = async () => {
      try {
        const me = await getMe()
        setDoctor(me.data)
        setFormData(prev => ({ ...prev, doctor: me.data.id }))

        const patRes = await getPatients()
        setPatients(patRes.data)

        const appRes = await getDoctorAppointments(me.data.id)
        setAppointments(appRes.data)

      } catch (e) {
          console.error(e)
      }
  }

  const handleSearch = async (e) => {
      const query = e.target.value
      setSearch(query)
      const res = await getPatients(query)
      setPatients(res.data)
  }

  const handleOpenBooking = (patientId) => {
    setFormData(prev => ({ ...prev, medical_record: patientId }))
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
        await createAppointment(formData)
        alert('Прием создан')
        setShowModal(false)
        loadData()
    } catch (error) {
        alert('Ошибка создания')
    }
  }

  const todayAppointments = appointments.filter(app => {
      const appDate = new Date(app.data_time).toDateString()
      const today = new Date().toDateString()
      return appDate === today
  })

  return (
    <div>
      <aside>
        <h3>Меню</h3>
        <p>Врач: {doctor?.last_name}</p>
        <button onClick={() => loadData()}>Обновить данные</button>
        <div onClick={() => { localStorage.removeItem('token'); navigate('/') }}>Выход</div>
      </aside>

      <main>

        <div >
            <div>
                <h3>Всего пациентов</h3>
                <span>{patients.length}</span>
            </div>
            <div>
                <h3>Визитов сегодня</h3>
                <span>{todayAppointments.length}</span>
            </div>
            <div>
                <h3>Алерты</h3>
                <span>{alerts.length}</span>
            </div>
        </div>

        <div>
            <h4>⚠️ Критические уведомления</h4>
            {alerts.map(a => (
                <div key={a.id}>
                    {a.text}
                </div>
            ))}
        </div>

        <h2>Реестр пациентов</h2>
        <input 
            placeholder="Поиск по ФИО или номеру карты..." 
            value={search}
            onChange={handleSearch}
        />
        
        <table border="1">
            <thead>
                <tr>
                    <th>№ Карты</th>
                    <th>ФИО</th>
                    <th>Действия</th>
                </tr>
            </thead>
            <tbody>
                {patients.map(p => (
                    <tr key={p.id}>
                        <td>{p.card_number}</td>
                        <td>{p.user ? `${p.user.last_name} ${p.user.first_name}` : ''}</td>
                        <td>
                            <button onClick={() => navigate(`/patient/${p.id}`)}>Карта</button>
                            <button onClick={() => handleOpenBooking(p.id)}>Записать</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>

        {showModal && (
            <div>
                <div>
                    <h3>Новое назначение</h3>
                    <form onSubmit={handleSubmit}>
                        <label>Дата и время:</label>
                        <input 
                            type="datetime-local" 
                            required
                            value={formData.data_time}
                            onChange={e => setFormData({...formData, data_time: e.target.value})}
                        />
                        <label>Причина:</label>
                        <textarea 
                            rows="3"
                            required
                            value={formData.reason}
                            onChange={e => setFormData({...formData, reason: e.target.value})}
                        />
                        <button type="submit">Сохранить</button>
                        <button type="button" onClick={() => setShowModal(false)}>Отмена</button>
                    </form>
                </div>
            </div>
        )}
      </main>
    </div>
  )
}