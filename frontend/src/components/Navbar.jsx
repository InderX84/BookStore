import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BookOpen, ShoppingCart, User, Menu, X, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">BookStore</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
            <Link to="/books" className="text-gray-700 hover:text-blue-600">Books</Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/cart" className="text-gray-700 hover:text-blue-600 flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-1" />
                  Cart
                </Link>
                <Link to="/orders" className="text-gray-700 hover:text-blue-600">Orders</Link>
                {user?.role === 'admin' && (
                  <div className="relative group">
                    <Link to="/admin" className="text-gray-700 hover:text-blue-600">Admin</Link>
                    <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                      <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dashboard</Link>
                      <Link to="/admin/books" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Books</Link>
                      <Link to="/admin/categories" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Categories</Link>
                      <Link to="/admin/bulk-import" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Bulk Import</Link>
                      <Link to="/admin/analytics" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Analytics</Link>
                      <Link to="/admin/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Orders</Link>
                      <Link to="/admin/users" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Users</Link>
                    </div>
                  </div>
                )}
                <div className="relative group">
                  <button className="flex items-center text-gray-700 hover:text-blue-600">
                    <User className="h-5 w-5 mr-1" />
                    {user?.name}
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <LogOut className="h-4 w-4 inline mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
              <Link to="/books" className="text-gray-700 hover:text-blue-600">Books</Link>
              
              {isAuthenticated ? (
                <>
                  <Link to="/cart" className="text-gray-700 hover:text-blue-600">Cart</Link>
                  <Link to="/orders" className="text-gray-700 hover:text-blue-600">Orders</Link>
                  {user?.role === 'admin' && (
                    <>
                      <Link to="/admin" className="text-gray-700 hover:text-blue-600">Admin Dashboard</Link>
                      <Link to="/admin/books" className="text-gray-700 hover:text-blue-600">Manage Books</Link>
                      <Link to="/admin/categories" className="text-gray-700 hover:text-blue-600">Manage Categories</Link>
                      <Link to="/admin/bulk-import" className="text-gray-700 hover:text-blue-600">Bulk Import</Link>
                      <Link to="/admin/analytics" className="text-gray-700 hover:text-blue-600">Analytics</Link>
                      <Link to="/admin/orders" className="text-gray-700 hover:text-blue-600">Manage Orders</Link>
                      <Link to="/admin/users" className="text-gray-700 hover:text-blue-600">Manage Users</Link>
                    </>
                  )}
                  <Link to="/profile" className="text-gray-700 hover:text-blue-600">Profile</Link>
                  <button onClick={handleLogout} className="text-left text-gray-700 hover:text-blue-600">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
                  <Link to="/register" className="text-gray-700 hover:text-blue-600">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}