import { Link } from 'react-router-dom'
import { BookOpen, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Brand */}
          <div className="flex items-center space-x-3 mb-6 md:mb-0">
            <BookOpen className="h-8 w-8 text-blue-400" />
            <div>
              <span className="text-2xl font-bold">BookStore</span>
              <p className="text-gray-400 text-sm">Discover. Read. Grow.</p>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-8 mb-6 md:mb-0">
            <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
            <Link to="/books" className="text-gray-300 hover:text-white transition-colors">Books</Link>
            <Link to="/orders" className="text-gray-300 hover:text-white transition-colors">Orders</Link>
            <Link to="/profile" className="text-gray-300 hover:text-white transition-colors">Profile</Link>
          </div>

          {/* Contact */}
          <div className="text-center md:text-right">
            <div className="flex items-center justify-center md:justify-end text-gray-400 mb-2">
              <Mail className="h-4 w-4 mr-2" />
              <span className="text-sm">support@bookstore.com</span>
            </div>
            <p className="text-xs text-gray-500">&copy; 2025 BookStore. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}