import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShoppingCart, User, Menu, X, Search, BookOpen, Heart, Star, Bell } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Layout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const { itemCount } = useCart()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  const handleLogout = async () => {
    await logout()
    setIsMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <BookOpen className="h-10 w-10 text-purple-600 group-hover:text-purple-700 transition-colors" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">BookVerse</span>
                <div className="text-xs text-gray-500 font-medium">Discover • Read • Explore</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              <Link
                to="/"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive('/') 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' 
                    : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                }`}
              >
                Home
              </Link>
              <Link
                to="/books"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive('/books') 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' 
                    : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                }`}
              >
                Books
              </Link>
              <Link
                to="/categories"
                className="px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all duration-200"
              >
                Categories
              </Link>
              <Link
                to="/bestsellers"
                className="px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all duration-200"
              >
                Bestsellers
              </Link>
              {isAuthenticated && user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    location.pathname.startsWith('/admin') 
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg' 
                      : 'text-orange-600 hover:bg-orange-50'
                  }`}
                >
                  Admin
                </Link>
              )}
            </nav>

            {/* Right side */}
            <div className="flex items-center space-x-3">
              {/* Search */}
              <div className="hidden md:block relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search books..."
                  className="pl-10 pr-4 py-2 w-64 rounded-full border border-gray-200 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                />
              </div>

              {/* Wishlist */}
              {isAuthenticated && (
                <button className="relative p-2 text-gray-600 hover:text-red-500 transition-colors">
                  <Heart className="h-6 w-6" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center text-[10px]">3</span>
                </button>
              )}

              {/* Cart */}
              <Link to="/cart" className="relative p-2 text-gray-600 hover:text-purple-600 transition-colors group">
                <ShoppingCart className="h-6 w-6 group-hover:scale-110 transition-transform" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-bounce">
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-full hover:bg-purple-50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <span className="hidden md:block text-sm font-medium text-gray-700">{user?.name}</span>
                  </button>

                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User className="h-4 w-4 mr-3" />
                        Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Star className="h-4 w-4 mr-3" />
                        Orders
                      </Link>
                      <Link
                        to="/notifications"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Bell className="h-4 w-4 mr-3" />
                        Notifications
                      </Link>
                      <hr className="my-2" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Join Now
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-gray-700 hover:text-purple-600 transition-colors"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden py-4 border-t border-purple-100">
              <div className="flex flex-col space-y-1">
                <Link
                  to="/"
                  className="px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/books"
                  className="px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Books
                </Link>
                <Link
                  to="/categories"
                  className="px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Categories
                </Link>
                {isAuthenticated && user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="px-4 py-3 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-purple-900 to-blue-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <BookOpen className="h-8 w-8 text-purple-400" />
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">BookVerse</span>
                  <div className="text-sm text-gray-400">Discover • Read • Explore</div>
                </div>
              </div>
              <p className="text-gray-300 mb-6 max-w-md">
                Embark on literary adventures with our curated collection of books. From bestsellers to hidden gems, find your next great read.
              </p>
              <div className="flex space-x-4">
                <button className="w-10 h-10 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center transition-colors">
                  <span className="text-sm font-bold">f</span>
                </button>
                <button className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors">
                  <span className="text-sm font-bold">t</span>
                </button>
                <button className="w-10 h-10 bg-pink-600 hover:bg-pink-700 rounded-full flex items-center justify-center transition-colors">
                  <span className="text-sm font-bold">i</span>
                </button>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-6 text-purple-300">Quick Links</h3>
              <ul className="space-y-3">
                <li><Link to="/books" className="text-gray-300 hover:text-white transition-colors flex items-center group"><span className="w-2 h-2 bg-purple-400 rounded-full mr-3 group-hover:bg-white transition-colors"></span>Browse Books</Link></li>
                <li><Link to="/bestsellers" className="text-gray-300 hover:text-white transition-colors flex items-center group"><span className="w-2 h-2 bg-purple-400 rounded-full mr-3 group-hover:bg-white transition-colors"></span>Bestsellers</Link></li>
                <li><Link to="/new-releases" className="text-gray-300 hover:text-white transition-colors flex items-center group"><span className="w-2 h-2 bg-purple-400 rounded-full mr-3 group-hover:bg-white transition-colors"></span>New Releases</Link></li>
                <li><Link to="/cart" className="text-gray-300 hover:text-white transition-colors flex items-center group"><span className="w-2 h-2 bg-purple-400 rounded-full mr-3 group-hover:bg-white transition-colors"></span>Shopping Cart</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-6 text-purple-300">Support</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center group"><span className="w-2 h-2 bg-blue-400 rounded-full mr-3 group-hover:bg-white transition-colors"></span>Help Center</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center group"><span className="w-2 h-2 bg-blue-400 rounded-full mr-3 group-hover:bg-white transition-colors"></span>Contact Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center group"><span className="w-2 h-2 bg-blue-400 rounded-full mr-3 group-hover:bg-white transition-colors"></span>Shipping Info</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center group"><span className="w-2 h-2 bg-blue-400 rounded-full mr-3 group-hover:bg-white transition-colors"></span>Returns</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">&copy; 2024 BookVerse. All rights reserved. Made with ❤️ for book lovers.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}