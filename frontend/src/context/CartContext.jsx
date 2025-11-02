import { createContext, useContext, useReducer, useEffect } from 'react'

const CartContext = createContext()

const cartItems = JSON.parse(localStorage.getItem('cart')) || []
const initialState = {
  items: cartItems,
  total: cartItems.reduce((total, item) => total + (item.price * item.quantity), 0),
  itemCount: cartItems.reduce((total, item) => total + item.quantity, 0)
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id)
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        )
        return { ...state, items: updatedItems }
      }
      
      return {
        ...state,
        items: [...state.items, action.payload]
      }
    }
    
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      }
    
    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0)
      
      return { ...state, items: updatedItems }
    }
    
    case 'CLEAR_CART':
      return { ...state, items: [] }
    
    case 'CALCULATE_TOTALS': {
      const itemCount = state.items.reduce((total, item) => total + item.quantity, 0)
      const total = state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
      
      return {
        ...state,
        itemCount,
        total: Number(total.toFixed(2))
      }
    }
    
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  useEffect(() => {
    dispatch({ type: 'CALCULATE_TOTALS' })
  }, [state.items])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items))
  }, [state.items])

  const addItem = (book, quantity = 1) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: book._id,
        title: book.title,
        authors: book.authors,
        price: book.price,
        image: book.images?.[0]?.url,
        quantity,
        stock: book.stock
      }
    })
  }

  const removeItem = (id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }

  const updateQuantity = (id, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const getItemQuantity = (id) => {
    const item = state.items.find(item => item.id === id)
    return item ? item.quantity : 0
  }

  const value = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemQuantity
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}