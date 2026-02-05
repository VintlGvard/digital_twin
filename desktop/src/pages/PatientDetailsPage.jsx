import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getPatientById, getPatientAppointments } from '../api'

export default function PatientDetails() {
    const { id } = useParams()
    const navigate = useNavigate()
    
    const [patient, setPatient] = useState(null)
    const [appointments, setAppointments] = useState([])
    const [tab, setTab] = useState('info')

    useEffect(() => {
        getPatientById(id).then(res => setPatient(res.data))
        getPatientAppointments(id).then(res => setAppointments(res.data))
    }, [id])

    if (!patient) return <div>Загрузка...</div>

    const user = patient.user || {}

    return (
        <div>
            <header>
                <button onClick={() => navigate(-1)}>← Назад</button>
                <h2>{user.last_name} {user.first_name} {user.surname}</h2>
                <span>{patient.card_number}</span>
            </header>

            <div>
                <button onClick={() => setTab('info')}>Обзор</button>
                <button onClick={() => setTab('history')}>История</button>
                <button onClick={() => setTab('appointments')}>Назначения</button>
            </div>

            <div>
                {tab === 'info' && (
                    <div>
                        <div>
                            <p><b>Телефон:</b> {user.phone_number || '-'}</p>
                            <p><b>Пол:</b> {user.gender === 'male' ? 'Мужской' : 'Женский'}</p>
                            <p><b>Группа крови:</b> <span>{patient.blood_type}</span></p>
                        </div>
                        <div>
                            <p><b>Паспорт:</b> {patient.series_passport} {patient.numbers_passport}</p>
                            <p><b>СНИЛС:</b> {patient.snils}</p>
                        </div>
                    </div>
                )}

                {tab === 'history' && (
                    <div>
                        <h3>Хронические заболевания</h3>
                        <p>{patient.chronic_diseases || "Записей нет"}</p>
                    </div>
                )}

                {tab === 'appointments' && (
                    <table border="1">
                        <thead>
                            <tr>
                                <th>Дата</th>
                                <th>Причина</th>
                                <th>Статус</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map(app => (
                                <tr key={app.id}>
                                    <td>{new Date(app.data_time).toLocaleString()}</td>
                                    <td>{app.reason}</td>
                                    <td>{app.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}