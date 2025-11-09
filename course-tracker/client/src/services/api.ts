// client/src/services/api.ts
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5001/api',
})

api.interceptors.request.use(
  (config) => {
    const userStored = localStorage.getItem('user')

    if (userStored) {
      const user = JSON.parse(userStored)
      const token = user.token

      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default api