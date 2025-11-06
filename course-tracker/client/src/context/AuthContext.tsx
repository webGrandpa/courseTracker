// client/src/context/AuthContext.tsx
import { 
  createContext, 
  useReducer, 
  useContext,
  useEffect 
} from 'react'
import type { ReactNode } from 'react'

// --- 1. ОПРЕДЕЛЯЕМ ТИПЫ ---

// Тип для нашего "состояния" (state)
interface AuthState {
  user: any | null // В идеале здесь будет интерфейс IUser
  token: string | null
  isLoading: boolean
}

// Тип для "команд" (actions)
type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: any }
  | { type: 'LOGOUT' }

// Тип для самого Контекста (что он будет "раздавать")
interface AuthContextType {
  state: AuthState
  dispatch: React.Dispatch<AuthAction>
}

// --- 2. ИНИЦИАЛИЗАЦИЯ ---

// Пробуем "загрузить" user с "жесткого диска" (localStorage)
const storedUser = localStorage.getItem('user')
const user = storedUser ? JSON.parse(storedUser) : null

// Начальное состояние "мозга"
const initialState: AuthState = {
  user: user,
  token: user ? user.token : null,
  isLoading: false,
}

// --- 3. СОЗДАНИЕ КОНТЕКСТА ---
export const AuthContext = createContext<AuthContextType | undefined>(undefined)

// --- 4. РЕДЬЮСЕР (Диспетчер команд) ---
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      // При логине мы получили { _id, email, token }
      return {
        ...state,
        user: action.payload,
        token: action.payload.token,
        isLoading: false,
      }
    case 'LOGOUT':
      // При выходе чистим "оперативную память"
      return {
        ...state,
        user: null,
        token: null,
      }
    default:
      return state
  }
}

// --- 5. ПРОВАЙДЕР ("Wi-Fi Роутер") ---
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Этот useEffect будет следить за 'state.user'.
  // Если user меняется (логин/выход), он обновит localStorage.
  useEffect(() => {
    if (state.user) {
      localStorage.setItem('user', JSON.stringify(state.user))
    } else {
      localStorage.removeItem('user')
    }
  }, [state.user])

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}

// --- 6. "Ярлык" (Custom Hook) ---
// Наш "Wi-Fi адаптер" для компонентов
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}