// client/src/App.tsx
import { Routes, Route, Outlet } from 'react-router-dom'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import CourseDetailPage from './pages/CourseDetailPage'

const AppLayout = () => (
  <div className="min-h-screen w-full bg-gray-900 font-sans">
    <Navbar />
    <main>
      <Outlet />
    </main>
  </div>
)

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/course/:id" element={<CourseDetailPage />} />
        <Route element={<ProtectedRoute />}>
          <Route index element={<DashboardPage />} />
        </Route>

      </Route>
    </Routes>
  )
}

export default App