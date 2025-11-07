// client/src/pages/LoginPage.test.tsx
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import LoginPage from './LoginPage'

// 1. 🔻🔻🔻 "ПОДДЕЛКА" (MOCKING) 🔻🔻🔻

// "Подделываем" react-router. 'vi.fn()' - это "шпион"
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  // @ts-ignore
  const actual = await importOriginal()
  return {
    ...actual, // Сохраняем все оригинальное (Link, Routes...)
    useNavigate: () => mockNavigate, // ...но ПОДМЕНЯЕМ useNavigate
  }
})

// "Подделываем" наш AuthContext
const mockDispatch = vi.fn()
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    dispatch: mockDispatch, // Подаем "фейковый" dispatch
    state: { user: null, token: null, isLoading: false }, // Фейковое состояние
  }),
}))

// "Подделываем" наш authService
vi.mock('../services/authService', () => ({
  default: {
    // Мы "подделываем" 'login', чтобы он возвращал "фейковый" успех
    login: vi.fn().mockResolvedValue({ 
      _id: '123', 
      email: 'test@test.com', 
      token: 'fake-token' 
    }),
  },
}))

// Импортируем authService ПОСЛЕ того, как он "подделан"
import authService from '../services/authService'

// 2. 🔻🔻🔻 "ЧИСТКА" 🔻🔻🔻
// После каждого теста "сбрасываем" счетчики у "шпионов"
beforeEach(() => {
  vi.clearAllMocks()
})

// 3. 🔻🔻🔻 ТЕСТЫ 🔻🔻🔻
describe('LoginPage Component', () => {

  // "Вспомогательная" функция, чтобы не повторять код
  const renderComponent = () => {
    render(
      // <MemoryRouter> - это "фейковый" BrowserRouter,
      // который нужен для тестов
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )
  }

  // Тест-кейс 1: "Должен "нарисовать" форму"
  test('should render the login form correctly', () => {
    renderComponent()

    // Ищем по "ярлыку" (лучшая практика)
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    // Ищем по "роли" (лучшая практика)
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument()
  })

  // Тест-кейс 2: "Должен успешно залогиниться"
  test('should call login service, dispatch, and navigate on successful login', async () => {
    renderComponent()

    // 1. "Робот" "печатает" в полях
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@test.com' },
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    })

    // 2. "Робот" "кликает" на кнопку
    fireEvent.click(screen.getByRole('button', { name: /Login/i }))

    // 3. 'waitFor' - мы "ждем", пока все async/await (в onSubmit) завершатся
    await waitFor(() => {
      // 4. ПРОВЕРКИ ("Ожидания")

      // "Ожидаем", что наш "фейковый" authService.login был "вызван" 1 раз
      // и с "правильными" данными
      expect(authService.login).toHaveBeenCalledTimes(1)
      expect(authService.login).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password123',
      })

      // "Ожидаем", что наш "фейковый" dispatch был "вызван"
      expect(mockDispatch).toHaveBeenCalledTimes(1)
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'LOGIN_SUCCESS',
        payload: { _id: '123', email: 'test@test.com', token: 'fake-token' },
      })

      // "Ожидаем", что наш "фейковый" navigate был "вызван"
      expect(mockNavigate).toHaveBeenCalledTimes(1)
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })
})