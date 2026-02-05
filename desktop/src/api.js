import axios from 'axios'

const API_URL = 'http://127.0.0.1:8000/api'
const api = axios.create({ baseURL: API_URL })

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

export const loginUser = (email, password) => api.post('/auth/jwt/create/', { email, password })
export const getPatients = () => api.get('/medical-records/')
export const getMe = () => api.get('/auth/users/me/')
export const createAppointment = (data) => api.post('/appointments/', data)
export const getPatientById = (id) => api.get(`/medical-records/${id}/`)
export const getPatientAppointments = (recordId) => api.get(`/appointments/?medical_record=${recordId}`)
export const getDoctorAppointments = (doctorId) => api.get(`/appointments/?doctor=${doctorId}`)

export default api