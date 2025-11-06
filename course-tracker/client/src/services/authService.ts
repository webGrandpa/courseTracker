// client/src/services/authService.ts
import axios from 'axios'

// Наш бэкенд API
const API_URL = 'http://localhost:5001/api/auth'

// Мы будем использовать 'any' для простоты,
// но в идеале здесь нужны интерфейсы

// Регистрация пользователя
const register = async (userData: any) => {
  // Отправляем POST запрос на '.../api/auth/register'
  const response = await axios.post(`${API_URL}/register`, userData)

  // Бэкенд возвращает { _id, email, token }
  // Если токен есть, сохраняем его в localStorage
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }
  return response.data
}

// Логин пользователя
const login = async (userData: any) => {
  const response = await axios.post(`${API_URL}/login`, userData)

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }
  return response.data
}

// Выход (просто чистим localStorage)
const logout = () => {
  localStorage.removeItem('user')
}

// Собираем все в один объект для экспорта
const authService = {
  register,
  login,
  logout,
}

export default authService