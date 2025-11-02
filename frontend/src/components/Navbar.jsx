import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BookOpen, ShoppingCart, User, Menu, X, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const { itemCount } = useCart()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-white">BookStore</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-white hover:text-blue-200 px-3 py-2 rounded-md transition-colors">Home</Link>
            <Link to="/books" className="text-white hover:text-blue-200 px-3 py-2 rounded-md transition-colors">Books</Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/cart" className="text-white hover:text-blue-200 flex items-center px-3 py-2 rounded-md transition-colors relative">
                  <ShoppingCart className="h-5 w-5 mr-1" />
                  Cart
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {itemCount}
                    </span>
                  )}
                </Link>
                <Link to="/orders" className="text-white hover:text-blue-200 px-3 py-2 rounded-md transition-colors">Orders</Link>

                <div className="relative group">
                  <button className="flex items-center text-white hover:text-blue-200 px-3 py-2 rounded-md transition-colors">
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
                <Link to="/login" className="text-white hover:text-blue-200 px-3 py-2 rounded-md transition-colors">Login</Link>
                <Link to="/register" className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 font-medium transition-colors">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-white hover:text-blue-200"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-blue-500">
            <div className="flex flex-col space-y-2">
              <Link to="/" className="text-white hover:text-blue-200 px-3 py-2 rounded-md">Home</Link>
              <Link to="/books" className="text-white hover:text-blue-200 px-3 py-2 rounded-md">Books</Link>
              
              {isAuthenticated ? (
                <>
                  <Link to="/cart" className="text-white hover:text-blue-200 px-3 py-2 rounded-md relative">
                    Cart
                    {itemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                        {itemCount}
                      </span>
                    )}
                  </Link>
                  <Link to="/orders" className="text-white hover:text-blue-200 px-3 py-2 rounded-md">Orders</Link>
                  {user?.role === 'admin' && (
                    <>
                      <Link to="/admin" className="text-white hover:text-blue-200 px-3 py-2 rounded-md">Admin Dashboard</Link>
                      <Link to="/admin/books" className="text-white hover:text-blue-200 px-3 py-2 rounded-md">Manage Books</Link>
                      <Link to="/admin/categories" className="text-white hover:text-blue-200 px-3 py-2 rounded-md">Manage Categories</Link>
                      <Link to="/admin/bulk-import" className="text-white hover:text-blue-200 px-3 py-2 rounded-md">Bulk Import</Link>
                      <Link to="/admin/analytics" className="text-white hover:text-blue-200 px-3 py-2 rounded-md">Analytics</Link>
                      <Link to="/admin/orders" className="text-white hover:text-blue-200 px-3 py-2 rounded-md">Manage Orders</Link>
                      <Link to="/admin/users" className="text-white hover:text-blue-200 px-3 py-2 rounded-md">Manage Users</Link>
                    </>
                  )}
                  <Link to="/profile" className="text-white hover:text-blue-200 px-3 py-2 rounded-md">Profile</Link>
                  <button onClick={handleLogout} className="text-left text-white hover:text-blue-200 px-3 py-2 rounded-md">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-white hover:text-blue-200 px-3 py-2 rounded-md">Login</Link>
                  <Link to="/register" className="text-white hover:text-blue-200 px-3 py-2 rounded-md">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}