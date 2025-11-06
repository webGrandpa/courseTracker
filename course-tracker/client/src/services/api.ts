// client/src/services/api.ts
import axios from 'axios'

// 1. Создаем "спецтелефон" (axios instance)
const api = axios.create({
  baseURL: 'http://localhost:5001/api', // Базовый URL нашего бэкенда
})

// 2. Создаем "секретаря" (Request Interceptor)
api.interceptors.request.use(
  (config) => {
    // "Секретарь" ищет 'user' (с токеном) в localStorage
    const userStored = localStorage.getItem('user')

    if (userStored) {
      const user = JSON.parse(userStored)
      const token = user.token

      if (token) {
        // Если "пропуск" (token) найден, прикрепляем его к "делу"
        config.headers['Authorization'] = `Bearer ${token}`
      }
    }
    // "Секретарь" отправляет "звонок" (request) дальше
    return config
  },
  (error) => {
    // Если что-то пошло не так
    return Promise.reject(error)
  }
)

export default api