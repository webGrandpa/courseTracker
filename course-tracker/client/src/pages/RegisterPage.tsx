// client/src/pages/RegisterPage.tsx
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import authService from '../services/authService'

const RegisterPage = () => {
  const { dispatch } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit, setError, formState: { errors } } = useForm()  //watch

  // const password = watch('password')

  const onSubmit = async (data: any) => {
    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', {
        type: 'manual',
        message: 'Passwords do not match',
      })
      return
    }

    try {
      const userData = await authService.register({
        email: data.email,
        password: data.password,
      })

      dispatch({ type: 'LOGIN_SUCCESS', payload: userData })

      navigate('/')
    } catch (error: any) {
      console.error('Failed to register:', error)
      if (error.response && error.response.data.message.includes('User already exists')) {
         setError('email', {
          type: 'manual',
          message: 'This email is already taken',
        })
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md rounded-lg bg-gray-800 p-8 shadow-lg"
      >
        <h1 className="mb-6 text-center text-3xl font-bold text-white">
          Register
        </h1>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-300">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register('email', { required: 'Email is required' })}
            className="w-full rounded-md border border-gray-600 bg-gray-700 p-2.5 text-white focus:border-blue-500 focus:outline-none"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-400">{errors.email.message as string}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-4">
          <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-300">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Must be at least 6 characters' } })}
            className="w-full rounded-md border border-gray-600 bg-gray-700 p-2.5 text-white focus:border-blue-500 focus:outline-none"
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-400">{errors.password.message as string}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="mb-6">
          <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-gray-300">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword', { required: 'Please confirm password' })}
            className="w-full rounded-md border border-gray-600 bg-gray-700 p-2.5 text-white focus:border-blue-500 focus:outline-none"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-400">{errors.confirmPassword.message as string}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 p-2.5 text-white hover:bg-blue-700 focus:outline-none"
        >
          Create Account
        </button>
      </form>
    </div>
  )
}

export default RegisterPage