import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { BookOpen, ArrowRight, Star, Users, ShoppingBag, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react'
import { booksService, publicService } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'

export default function Home() {
  const { isAuthenticated, user } = useAuth()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  const { data: books, isLoading } = useQuery({
    queryKey: ['featured-books'],
    queryFn: () => booksService.getBooks({ limit: 12 }),
    select: data => data.data.books
  })

  useEffect(() => {
    const cardsPerSlide = isMobile ? 1 : 4
    if (books?.length > cardsPerSlide) {
      const interval = setInterval(() => {
        setCurrentSlide(prev => prev === Math.ceil(books.length / cardsPerSlide) - 1 ? 0 : prev + 1)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [books?.length, isMobile])

  const { data: stats } = useQuery({
    queryKey: ['home-stats'],
    queryFn: () => publicService.getStats(),
    select: data => data.data
  })

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white min-h-screen flex items-center relative overflow-hidden -mt-16 pt-16">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
              Discover Your Next
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Great Read
              </span>
            </h1>
            <p className="text-2xl mb-12 text-blue-100 max-w-3xl mx-auto">
              India's largest online bookstore with millions of titles, instant delivery, and unbeatable prices.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/books"
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:from-orange-600 hover:to-orange-700 inline-flex items-center justify-center shadow-2xl transform hover:scale-105 transition-all"
              >
                <BookOpen className="mr-3 h-6 w-6" />
                Explore Books
              </Link>
              {!isAuthenticated ? (
                <Link
                  to="/register"
                  className="border-3 border-white text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white hover:text-blue-600 inline-flex items-center justify-center transform hover:scale-105 transition-all"
                >
                  Join Free Today
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Link>
              ) : (
                <Link
                  to={user?.role === 'admin' ? '/admin' : '/profile'}
                  className="border-3 border-white text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white hover:text-blue-600 inline-flex items-center justify-center transform hover:scale-105 transition-all"
                >
                  {user?.role === 'admin' ? 'Admin Dashboard' : 'My Account'}
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Link>
              )}
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20 hover:bg-white/20 transition-all">
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-yellow-300" />
              <div className="text-3xl font-bold mb-2">{stats?.totalBooks?.toLocaleString() || '0'}</div>
              <div className="text-blue-200 font-medium">Books Available</div>
            </div>
            <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20 hover:bg-white/20 transition-all">
              <Users className="h-16 w-16 mx-auto mb-4 text-green-300" />
              <div className="text-3xl font-bold mb-2">{stats?.totalUsers?.toLocaleString() || '0'}</div>
              <div className="text-blue-200 font-medium">Happy Readers</div>
            </div>
            <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20 hover:bg-white/20 transition-all">
              <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-pink-300" />
              <div className="text-3xl font-bold mb-2">{stats?.totalOrders?.toLocaleString() || '0'}</div>
              <div className="text-blue-200 font-medium">Orders Delivered</div>
            </div>
            <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20 hover:bg-white/20 transition-all">
              <TrendingUp className="h-16 w-16 mx-auto mb-4 text-orange-300" />
              <div className="text-3xl font-bold mb-2">₹{stats?.totalRevenue ? (stats.totalRevenue / 100000).toFixed(1) + 'L' : '0'}</div>
              <div className="text-blue-200 font-medium">Revenue Generated</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 text-gray-900">Why Choose BookStore?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Experience the future of online book shopping with unmatched service and selection</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white rounded-3xl p-10 text-center shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Lightning Fast Delivery</h3>
              <p className="text-gray-600 text-lg">Free same-day delivery across major Indian cities on orders above ₹499</p>
            </div>
            <div className="bg-white rounded-3xl p-10 text-center shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all">
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Star className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Unbeatable Prices</h3>
              <p className="text-gray-600 text-lg">Guaranteed lowest prices with exclusive member discounts up to 70% off</p>
            </div>
            <div className="bg-white rounded-3xl p-10 text-center shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Massive Collection</h3>
              <p className="text-gray-600 text-lg">Over {stats?.totalBooks?.toLocaleString() || '10,000'} books across all genres, languages, and formats</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 text-gray-900">Trending Books</h2>
            <p className="text-xl text-gray-600 mb-8">Discover the most popular books loved by readers across India</p>
            <Link
              to="/books"
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-2xl font-bold hover:from-blue-700 hover:to-blue-800 inline-flex items-center shadow-lg transform hover:scale-105 transition-all"
            >
              View All Books
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : books?.length > 0 ? (
            <div className="relative">
              <div className="overflow-hidden rounded-3xl">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {Array.from({ length: Math.ceil(books.length / (isMobile ? 1 : 4)) }).map((_, slideIndex) => (
                    <div key={slideIndex} className="w-full flex-shrink-0">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-4">
                        {books.slice(slideIndex * (isMobile ? 1 : 4), (slideIndex + 1) * (isMobile ? 1 : 4)).map(book => (
                          <Link
                            key={book._id}
                            to={`/books/${book._id}`}
                            className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 group hover:-translate-y-3 border border-gray-100"
                          >
                            <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl mb-6 overflow-hidden">
                              <img
                                src={book.images?.[0]?.url || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop'}
                                alt={book.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-lg">{book.title}</h3>
                            <p className="text-gray-600 mb-4">{book.authors?.join(', ')}</p>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-2xl font-bold text-blue-600">₹{book.price?.toFixed(2)}</span>
                                {book.ratingAvg > 0 && (
                                  <div className="flex items-center bg-yellow-100 px-3 py-1 rounded-full">
                                    <Star className="h-4 w-4 fill-current text-yellow-500" />
                                    <span className="text-sm ml-1 font-semibold">{book.ratingAvg.toFixed(1)}</span>
                                  </div>
                                )}
                              </div>
                              {(book.featured || book.bestseller) && (
                                <div className="flex gap-2 flex-wrap">
                                  {book.featured && <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">Featured</span>}
                                  {book.bestseller && <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-xs font-bold">Bestseller</span>}
                                </div>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Navigation Buttons */}
              {Math.ceil(books.length / (isMobile ? 1 : 4)) > 1 && (
                <>
                  <button
                    onClick={() => setCurrentSlide(prev => prev === 0 ? Math.ceil(books.length / (isMobile ? 1 : 4)) - 1 : prev - 1)}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-xl hover:shadow-2xl transition-all z-10 border border-gray-200"
                  >
                    <ChevronLeft className="h-6 w-6 text-gray-600" />
                  </button>
                  <button
                    onClick={() => setCurrentSlide(prev => prev === Math.ceil(books.length / (isMobile ? 1 : 4)) - 1 ? 0 : prev + 1)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-xl hover:shadow-2xl transition-all z-10 border border-gray-200"
                  >
                    <ChevronRight className="h-6 w-6 text-gray-600" />
                  </button>
                </>
              )}
              
              {/* Dots Indicator */}
              {Math.ceil(books.length / (isMobile ? 1 : 4)) > 1 && (
                <div className="flex justify-center mt-8 space-x-2">
                  {Array.from({ length: Math.ceil(books.length / (isMobile ? 1 : 4)) }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        currentSlide === index ? 'bg-blue-600 w-8' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16">
              <BookOpen className="h-20 w-20 text-gray-300 mx-auto mb-6" />
              <p className="text-xl text-gray-500">No featured books available at the moment</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-6xl font-bold mb-8">Ready to Start Reading?</h2>
            <p className="text-2xl mb-12 text-purple-100">Join over {stats?.totalUsers?.toLocaleString() || '10,000'} book lovers and discover your next favorite book today</p>
            <Link
              to="/register"
              className="bg-white text-purple-600 px-12 py-6 rounded-2xl font-bold text-xl hover:bg-gray-100 inline-flex items-center shadow-2xl transform hover:scale-105 transition-all"
            >
              Start Your Journey - It's Free!
              <ArrowRight className="ml-3 h-6 w-6" />
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}