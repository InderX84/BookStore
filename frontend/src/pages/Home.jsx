import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { BookOpen, ArrowRight, Star, Users, ShoppingBag, TrendingUp } from 'lucide-react'
import { booksService, publicService } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { isAuthenticated, user } = useAuth()
  
  const { data: books, isLoading } = useQuery({
    queryKey: ['featured-books'],
    queryFn: () => booksService.getBooks({ limit: 8 }),
    select: data => data.data.books
  })

  const { data: stats } = useQuery({
    queryKey: ['home-stats'],
    queryFn: () => publicService.getStats(),
    select: data => data.data
  })

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6">
                India's Premier
                <span className="block text-yellow-300">Book Destination</span>
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Discover millions of books with fast delivery across India. 
                From bestsellers to rare finds, we have it all.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/books"
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 inline-flex items-center justify-center"
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  Explore Books
                </Link>
                {!isAuthenticated ? (
                  <Link
                    to="/register"
                    className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 inline-flex items-center justify-center"
                  >
                    Join Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                ) : (
                  <Link
                    to={user?.role === 'admin' ? '/admin' : '/profile'}
                    className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 inline-flex items-center justify-center"
                  >
                    {user?.role === 'admin' ? 'Admin Dashboard' : 'My Profile'}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-yellow-300" />
                <div className="text-2xl font-bold">{stats?.totalBooks || 0}</div>
                <div className="text-blue-200">Books Available</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-green-300" />
                <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
                <div className="text-blue-200">Registered Users</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center">
                <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-pink-300" />
                <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
                <div className="text-blue-200">Orders Placed</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-orange-300" />
                <div className="text-2xl font-bold">₹{stats?.totalRevenue ? (stats.totalRevenue / 1000).toFixed(0) + 'K' : '0'}</div>
                <div className="text-blue-200">Total Revenue</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose BookStore?</h2>
            <p className="text-gray-600">Experience the best of online book shopping in India</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Free delivery across India on orders above ₹499</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
              <p className="text-gray-600">Guaranteed lowest prices with exclusive discounts</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Vast Collection</h3>
              <p className="text-gray-600">Over {stats?.totalBooks || 0} books across all genres and languages</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Books</h2>
              <p className="text-gray-600">Handpicked bestsellers and trending titles</p>
            </div>
            <Link
              to="/books"
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center"
            >
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {books?.map(book => (
                <Link
                  key={book._id}
                  to={`/books/${book._id}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 group"
                >
                  <div className="aspect-[3/4] bg-gray-200 rounded mb-4 overflow-hidden">
                    <img
                      src={book.images?.[0]?.url || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop'}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{book.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{book.authors.join(', ')}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-blue-600">₹{book.price.toFixed(2)}</span>
                      {book.ratingAvg > 0 && (
                        <div className="flex items-center text-yellow-500">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="text-sm ml-1">{book.ratingAvg}</span>
                        </div>
                      )}
                    </div>
                    {(book.featured || book.bestseller) && (
                      <div className="flex gap-1">
                        {book.featured && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">Featured</span>}
                        {book.bestseller && <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Bestseller</span>}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Start Your Reading Journey Today</h2>
            <p className="text-xl mb-8">Join thousands of book lovers across India</p>
            <Link
              to="/register"
              className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 inline-flex items-center"
            >
              Create Free Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}