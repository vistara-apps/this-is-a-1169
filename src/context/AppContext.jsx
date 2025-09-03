import React, { createContext, useContext, useReducer } from 'react'

const AppContext = createContext()

const initialState = {
  user: {
    userId: 'user-1',
    email: 'founder@example.com',
    subscriptionTier: 'free',
    aiCredits: 5
  },
  businessModels: [],
  simulations: [],
  currentConfig: null,
  loading: false,
  error: null
}

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    case 'ADD_BUSINESS_MODEL':
      return { 
        ...state, 
        businessModels: [...state.businessModels, action.payload],
        currentConfig: action.payload
      }
    case 'UPDATE_BUSINESS_MODEL':
      return {
        ...state,
        businessModels: state.businessModels.map(model =>
          model.configId === action.payload.configId ? action.payload : model
        ),
        currentConfig: action.payload
      }
    case 'ADD_SIMULATION':
      return { 
        ...state, 
        simulations: [...state.simulations, action.payload] 
      }
    case 'SET_CURRENT_CONFIG':
      return { ...state, currentConfig: action.payload }
    case 'USE_AI_CREDIT':
      return {
        ...state,
        user: {
          ...state.user,
          aiCredits: Math.max(0, state.user.aiCredits - 1)
        }
      }
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}