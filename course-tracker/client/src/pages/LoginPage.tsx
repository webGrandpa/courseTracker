// client/src/pages/LoginPage.tsx
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import authService from '../services/authService'

const LoginPage = () => {
  const { dispatch } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit } = useForm()

  // Эта функция запускается, когда форма валидна
  const onSubmit = async (data: any) => {
    try {
      // 1. "Звоним" на бэкенд
      const userData = await authService.login(data)

      // 2. "Сообщаем" нашему "мозгу" (Context) об успехе
      dispatch({ type: 'LOGIN_SUCCESS', payload: userData })

      // 3. Перенаправляем пользователя на главную
      navigate('/')
    } catch (error) {
      console.error('Failed to login:', error)
      // (Здесь мы бы показали ошибку пользователю)
    }
  }

  return (
    // --- Минимальный Стиль Каркаса (Tailwind) ---
    <div className="flex min-h-screen items-center justify-center p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        // Каркас: темная карточка, отступы, скругление
        className="w-full max-w-md rounded-lg bg-gray-800 p-8 shadow-lg"
      >
        <h1 className="mb-6 text-center text-3xl font-bold text-white">
          Login
        </h1>

        {/* Группа для Email */}
        <div className="mb-4">
          <label 
            htmlFor="email" 
            className="mb-2 block text-sm font-medium text-gray-300"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register('email', { required: true })}
            // Каркас: поля ввода в техно-стиле
            className="w-full rounded-md border border-gray-600 bg-gray-700 p-2.5 text-white focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Группа для Пароля */}
        <div className="mb-6">
          <label 
            htmlFor="password" 
            className="mb-2 block text-sm font-medium text-gray-300"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register('password', { required: true })}
            className="w-full rounded-md border border-gray-600 bg-gray-700 p-2.5 text-white focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Кнопка */}
        <button
          type="submit"
          // Каркас: кнопка на всю ширину, синий акцент
          className="w-full rounded-lg bg-blue-600 p-2.5 text-white hover:bg-blue-700 focus:outline-none"
        >
          Login
        </button>

        {/* (Мы добавим ссылку на /register здесь позже) */}
      </form>
    </div>
  )
}

export default LoginPage