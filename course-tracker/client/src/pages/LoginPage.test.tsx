// client/src/pages/LoginPage.test.tsx
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import LoginPage from './LoginPage'


const mockNavigate = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  // @ts-ignore
  const actual = await importOriginal<Record<string, any>>()
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

//"ფეიკი" Auth Context
const mockDispatch = vi.fn()
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    dispatch: mockDispatch,
    state: { user: null, token: null, isLoading: false },
  }),
}))

//"ფეიკი" authService
vi.mock('../services/authService', () => ({
  default: {
    login: vi.fn().mockResolvedValue({
      _id: '123',
      email: 'test@test.com',
      token: 'fake-token',
    }),
  },
}))

import authService from '../services/authService'

beforeEach(() => {
  vi.clearAllMocks()
})

// ტესტების ჯგუფი
describe('LoginPage Component', () => {

  const renderComponent = () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )
  }

  test('should render the login form correctly', () => {
    renderComponent()

    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument()
  })

  test('should call login service, dispatch, and navigate on successful login', async () => {
    renderComponent()

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@test.com' },
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    })

    fireEvent.click(screen.getByRole('button', { name: /Login/i }))

    await waitFor(() => {

      expect(authService.login).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password123',
      })

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'LOGIN_SUCCESS',
        payload: { _id: '123', email: 'test@test.com', token: 'fake-token' },
      })

      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })
})