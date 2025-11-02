import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ShoppingCart, Plus, Minus, Star, Heart, Share2 } from 'lucide-react'
import { booksService } from '../services/api'
import { useAuth } from '../context/AuthContext'
import ReviewForm from '../components/ReviewForm'
import ReviewsList from '../components/ReviewsList'
import toast from 'react-hot-toast'

export default function BookDetail() {
  const { id } = useParams()
  const { isAuthenticated } = useAuth()
  const [quantity, setQuantity] = useState(1)

  const { data: book, isLoading } = useQuery({
    queryKey: ['book', id],
    queryFn: () => booksService.getBook(id),
    select: data => data.data
  })

  const addToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart')
      return
    }
    
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingItem = cartItems.find(item => item.bookId === book._id)
    
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cartItems.push({
        bookId: book._id,
        title: book.title,
        price: book.price,
        image: book.images?.[0]?.url,
        quantity
      })
    }
    
    localStorage.setItem('cart', JSON.stringify(cartItems))
    toast.success('Added to cart!')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Book not found</h2>
          <p className="text-gray-600">The book you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Book Image */}
            <div className="aspect-[3/4] bg-gray-200 rounded-lg">
              <img
                src={book.images?.[0]?.url || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop'}
                alt={book.title}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            {/* Book Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold mb-3 text-gray-900">{book.title}</h1>
                <p className="text-xl text-gray-600 mb-4">by {book.authors.join(', ')}</p>
                
                {/* Rating */}
                {book.ratingAvg > 0 && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(book.ratingAvg)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-lg font-medium">{book.ratingAvg.toFixed(1)}</span>
                    <span className="text-gray-500">({book.ratingCount || 0} reviews)</span>
                  </div>
                )}
                
                <div className="mb-6">
                  {book.originalPrice && book.discount > 0 ? (
                    <div>
                      <div className="text-3xl font-bold text-blue-600">₹{book.price.toFixed(2)}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg text-gray-500 line-through">₹{book.originalPrice.toFixed(2)}</span>
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">{book.discount}% OFF</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-3xl font-bold text-blue-600">₹{book.price.toFixed(2)}</div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-gray-200 rounded-xl">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:bg-gray-100 rounded-l-xl"
                    >
                      <Minus className="h-5 w-5" />
                    </button>
                    <span className="px-6 py-3 border-x-2 border-gray-200 font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 hover:bg-gray-100 rounded-r-xl"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <button
                    onClick={addToCart}
                    disabled={book.stock === 0}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-8 rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 flex items-center justify-center shadow-lg transition-all"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </button>
                </div>
                
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                    <Heart className="h-5 w-5" />
                    Wishlist
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                    <Share2 className="h-5 w-5" />
                    Share
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-900">Description</h3>
                <p className="text-gray-700 leading-relaxed">{book.description}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-900">Book Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-lg"><span className="font-semibold text-gray-600">Publisher:</span> <span className="text-gray-900">{book.publisher || 'N/A'}</span></div>
                  <div className="bg-white p-3 rounded-lg"><span className="font-semibold text-gray-600">Language:</span> <span className="text-gray-900">{book.language}</span></div>
                  <div className="bg-white p-3 rounded-lg"><span className="font-semibold text-gray-600">Pages:</span> <span className="text-gray-900">{book.pages || 'N/A'}</span></div>
                  <div className="bg-white p-3 rounded-lg"><span className="font-semibold text-gray-600">Format:</span> <span className="text-gray-900">{book.format || 'N/A'}</span></div>
                  <div className="bg-white p-3 rounded-lg md:col-span-2"><span className="font-semibold text-gray-600">Categories:</span> <span className="text-gray-900">{book.categories?.join(', ') || 'N/A'}</span></div>
                  <div className="bg-white p-3 rounded-lg"><span className="font-semibold text-gray-600">Stock:</span> <span className={`font-bold ${book.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>{book.stock} available</span></div>
                  {book.isbn && <div className="bg-white p-3 rounded-lg"><span className="font-semibold text-gray-600">ISBN:</span> <span className="text-gray-900">{book.isbn}</span></div>}
                </div>
              </div>
              
              {(book.featured || book.bestseller) && (
                <div className="flex gap-2">
                  {book.featured && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">Featured</span>}
                  {book.bestseller && <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Bestseller</span>}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Reviews Section */}
        <div className="mt-8 space-y-6">
          <ReviewForm bookId={book._id} />
          <ReviewsList bookId={book._id} />
        </div>
      </div>
    </div>
  )
}