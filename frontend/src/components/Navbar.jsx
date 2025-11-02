import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BookOpen, ShoppingCart, User, Menu, X, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const { itemCount } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-transparent md:bg-transparent bg-black/30 backdrop-blur-sm md:backdrop-blur-none'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg transition-colors ${
              scrolled ? 'bg-white' : 'bg-white/90'
            }`}>
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <span className={`text-2xl font-bold transition-colors ${
              scrolled ? 'text-gray-900' : 'text-white md:text-white text-gray-900'
            }`}>BookStore</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className={`px-3 py-2 rounded-md transition-colors ${
              scrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white md:text-white text-gray-900 hover:text-blue-200 md:hover:text-blue-200 hover:text-blue-600'
            }`}>Home</Link>
            <Link to="/books" className={`px-3 py-2 rounded-md transition-colors ${
              scrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white md:text-white text-gray-900 hover:text-blue-200 md:hover:text-blue-200 hover:text-blue-600'
            }`}>Books</Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/cart" className={`flex items-center px-3 py-2 rounded-md transition-colors relative ${
                  scrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white md:text-white text-gray-900 hover:text-blue-200 md:hover:text-blue-200 hover:text-blue-600'
                }`}>
                  <ShoppingCart className="h-5 w-5 mr-1" />
                  Cart
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {itemCount}
                    </span>
                  )}
                </Link>
                <Link to="/orders" className={`px-3 py-2 rounded-md transition-colors ${
                  scrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white md:text-white text-gray-900 hover:text-blue-200 md:hover:text-blue-200 hover:text-blue-600'
                }`}>Orders</Link>

                <div className="relative group">
                  <button className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                    scrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white md:text-white text-gray-900 hover:text-blue-200 md:hover:text-blue-200 hover:text-blue-600'
                  }`}>
                    <div className="bg-white p-1 rounded-full mr-2">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    {user?.name}
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
                    {user?.role === 'admin' && (
                      <>
                        <div className="border-t my-1"></div>
                        <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Admin Dashboard</Link>
                        <Link to="/admin/books" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Manage Books</Link>
                        <Link to="/admin/categories" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Categories</Link>
                        <Link to="/admin/bulk-import" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Bulk Import</Link>
                        <Link to="/admin/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Orders</Link>
                        <Link to="/admin/users" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Users</Link>
                      </>
                    )}
                    <div className="border-t my-1"></div>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <LogOut className="h-4 w-4 inline mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className={`px-3 py-2 rounded-md transition-colors ${
                  scrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white md:text-white text-gray-900 hover:text-blue-200 md:hover:text-blue-200 hover:text-blue-600'
                }`}>Login</Link>
                <Link to="/register" className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  scrolled 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-white text-blue-600 hover:bg-blue-50'
                }`}>
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 transition-colors ${
              scrolled ? 'text-gray-700 hover:text-blue-600' : 'text-gray-900 hover:text-blue-600'
            }`}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className={`md:hidden py-4 border-t ${
            scrolled ? 'border-gray-200 bg-white/95 backdrop-blur-md' : 'border-white/20 bg-black/40 backdrop-blur-md'
          }`}>
            <div className="flex flex-col space-y-2">
              <Link to="/" className={`px-3 py-2 rounded-md transition-colors ${
                scrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-200'
              }`}>Home</Link>
              <Link to="/books" className={`px-3 py-2 rounded-md transition-colors ${
                scrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-200'
              }`}>Books</Link>
              
              {isAuthenticated ? (
                <>
                  <Link to="/cart" className={`px-3 py-2 rounded-md relative transition-colors ${
                    scrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-200'
                  }`}>
                    Cart
                    {itemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                        {itemCount}
                      </span>
                    )}
                  </Link>
                  <Link to="/orders" className={`px-3 py-2 rounded-md transition-colors ${
                    scrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-200'
                  }`}>Orders</Link>
                  {user?.role === 'admin' && (
                    <>
                      <Link to="/admin" className={`px-3 py-2 rounded-md transition-colors ${
                        scrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-200'
                      }`}>Admin Dashboard</Link>
                      <Link to="/admin/books" className={`px-3 py-2 rounded-md transition-colors ${
                        scrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-200'
                      }`}>Manage Books</Link>
                      <Link to="/admin/categories" className={`px-3 py-2 rounded-md transition-colors ${
                        scrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-200'
                      }`}>Manage Categories</Link>
                      <Link to="/admin/bulk-import" className={`px-3 py-2 rounded-md transition-colors ${
                        scrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-200'
                      }`}>Bulk Import</Link>
                      <Link to="/admin/analytics" className={`px-3 py-2 rounded-md transition-colors ${
                        scrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-200'
                      }`}>Analytics</Link>
                      <Link to="/admin/orders" className={`px-3 py-2 rounded-md transition-colors ${
                        scrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-200'
                      }`}>Manage Orders</Link>
                      <Link to="/admin/users" className={`px-3 py-2 rounded-md transition-colors ${
                        scrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-200'
                      }`}>Manage Users</Link>
                    </>
                  )}
                  <Link to="/profile" className={`px-3 py-2 rounded-md transition-colors ${
                    scrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-200'
                  }`}>Profile</Link>
                  <button onClick={handleLogout} className={`text-left px-3 py-2 rounded-md transition-colors ${
                    scrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-200'
                  }`}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className={`px-3 py-2 rounded-md transition-colors ${
                    scrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-200'
                  }`}>Login</Link>
                  <Link to="/register" className={`px-3 py-2 rounded-md transition-colors ${
                    scrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-200'
                  }`}>Sign Up</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}