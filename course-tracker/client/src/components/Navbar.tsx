// client/src/components/Navbar.tsx
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import authService from '../services/authService'

const Navbar = () => {
  // 1. "Подключаемся к Wi-Fi", чтобы проверить, кто залогинен
  const { state, dispatch } = useAuth()
  const navigate = useNavigate()

  // 2. Функция для Выхода
  const handleLogout = () => {
    authService.logout() // Чистим localStorage
    dispatch({ type: 'LOGOUT' }) // Чистим "мозг" (AuthContext)
    navigate('/login') // Перенаправляем на логин
  }

  return (
    // --- Минимальный Каркас (Tailwind) ---
    // "Техно-стиль": темный, с нижней границей
    <nav className="bg-gray-800 p-4 text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between">

        {/* 1. Лого/Название (ссылка на главную) */}
        <Link to="/" className="text-2xl font-bold text-white">
          CourseTracker
        </Link>

        {/* 2. Навигационные ссылки */}
        <div className="flex items-center space-x-4">
          {state.user ? (
            // --- Если пользователь ЗАЛОГИНЕН ---
            <>
              <span className="text-gray-300">
                Hello, {state.user.email}
              </span>
              <button
                onClick={handleLogout}
                className="rounded bg-red-600 px-3 py-1 text-sm hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            // --- Если пользователь НЕ залогинен ---
            <>
              <Link to="/login" className="hover:text-gray-300">
                Login
              </Link>
              <Link
                to="/register"
                className="rounded bg-blue-600 px-3 py-1 text-sm hover:bg-blue-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar