import { createContext, useContext, useReducer, useEffect } from 'react'
import { authService } from '../services/api'

const AuthContext = createContext()

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  refreshToken: localStorage.getItem('refreshToken'),
  loading: true,
  isAuthenticated: false
}

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.accessToken)
      localStorage.setItem('refreshToken', action.payload.refreshToken)
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        loading: false
      }
    case 'LOGOUT':
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      return {
        ...state,
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        loading: false
      }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        loading: false
      }
    case 'TOKEN_REFRESH':
      localStorage.setItem('token', action.payload.accessToken)
      localStorage.setItem('refreshToken', action.payload.refreshToken)
      return {
        ...state,
        token: action.payload.accessToken,
        refreshToken: action.payload.refreshToken
      }
    default:
      return state
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    const initAuth = async () => {
      if (state.token) {
        try {
          const response = await authService.getCurrentUser()
          dispatch({ type: 'SET_USER', payload: response.data.user })
        } catch (error) {
          dispatch({ type: 'LOGOUT' })
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    initAuth()
  }, [state.token])

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials)
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.data })
      return response.data
    } catch (error) {
      throw error
    }
  }

  const register = async (userData) => {
    try {
      const response = await authService.register(userData)
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.data })
      return response.data
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      if (state.refreshToken) {
        await authService.logout(state.refreshToken)
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      dispatch({ type: 'LOGOUT' })
    }
  }

  const refreshToken = async () => {
    try {
      const response = await authService.refreshToken(state.refreshToken)
      dispatch({ type: 'TOKEN_REFRESH', payload: response.data })
      return response.data.accessToken
    } catch (error) {
      dispatch({ type: 'LOGOUT' })
      throw error
    }
  }

  const value = {
    ...state,
    login,
    register,
    logout,
    refreshToken
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}