// client/src/pages/LoginPage.tsx
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import authService from '../services/authService'

const LoginPage = () => {
  const { dispatch } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit } = useForm()

  const onSubmit = async (data: any) => {
    try {
      const userData = await authService.login(data)

      dispatch({ type: 'LOGIN_SUCCESS', payload: userData })
      dispatch({ type: 'LOGIN_SUCCESS', payload: userData })

      navigate('/')
    } catch (error) {
      console.error('Failed to login:', error)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md rounded-lg bg-gray-800 p-8 shadow-lg"
      >
        <h1 className="mb-6 text-center text-3xl font-bold text-white">
          Login
        </h1>

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
            className="w-full rounded-md border border-gray-600 bg-gray-700 p-2.5 text-white focus:border-blue-500 focus:outline-none"
          />
        </div>

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

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 p-2.5 text-white hover:bg-blue-700 focus:outline-none"
        >
          Login
        </button>

      </form>
    </div>
  )
}

export default LoginPage