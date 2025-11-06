// client/src/components/ProtectedRoute.tsx
import { useAuth } from '../context/AuthContext'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = () => {
  // 1. "Подключаемся к Wi-Fi" и проверяем, залогинен ли юзер
  const { state } = useAuth()

  // 2. Проверяем, идет ли еще "загрузка" состояния
  // (Это полезно для будущих проверок токена, пока оставим)
  if (state.isLoading) {
    // Можно показать "загрузчик" (Spinner)
    return <div className="text-white">Loading...</div>
  }

  // 3. Если загрузка прошла, и юзера НЕТ, "выбрасываем" его на /login
  if (!state.user) {
    // <Navigate> - это компонент-редирект от react-router
    return <Navigate to="/login" replace />
  }

  // 4. Если юзер ЕСТЬ, показываем "портал" (<Outlet>),
  // который отобразит вложенную страницу (например, Dashboard)
  return <Outlet />
}

export default ProtectedRoute