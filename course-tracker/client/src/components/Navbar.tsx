// client/src/components/Navbar.tsx
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import authService from '../services/authService'

const Navbar = () => {
  const { state, dispatch } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    authService.logout()
    dispatch({ type: 'LOGOUT' }) 
    navigate('/login')
  }

  return (
    <nav className="bg-gray-800 p-4 text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between">

        <Link to="/" className="text-2xl font-bold text-white">
          CourseTracker
        </Link>

        <div className="flex items-center space-x-4">
          {state.user ? (
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