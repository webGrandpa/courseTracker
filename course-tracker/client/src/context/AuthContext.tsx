// client/src/context/AuthContext.tsx
import { 
  createContext, 
  useReducer, 
  useContext,
  useEffect 
} from 'react'
import type { ReactNode } from 'react'


interface AuthState {
  user: any | null
  token: string | null
  isLoading: boolean
}

type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: any }
  | { type: 'LOGOUT' }

interface AuthContextType {
  state: AuthState
  dispatch: React.Dispatch<AuthAction>
}


const storedUser = localStorage.getItem('user')
const user = storedUser ? JSON.parse(storedUser) : null

const initialState: AuthState = {
  user: user,
  token: user ? user.token : null,
  isLoading: false,
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        token: action.payload.token,
        isLoading: false,
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
      }
    default:
      return state
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

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

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}