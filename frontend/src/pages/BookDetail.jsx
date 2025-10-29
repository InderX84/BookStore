import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ShoppingCart, Plus, Minus } from 'lucide-react'
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
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
                <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
                <p className="text-lg text-gray-600 mb-4">by {book.authors.join(', ')}</p>
                <div className="mb-4">
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

              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 border-x">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-gray-100"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                
                <button
                  onClick={addToCart}
                  disabled={book.stock === 0}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </button>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Description</h3>
                <p className="text-gray-700">{book.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="font-medium">Publisher:</span> {book.publisher || 'N/A'}</div>
                <div><span className="font-medium">Language:</span> {book.language}</div>
                <div><span className="font-medium">Pages:</span> {book.pages || 'N/A'}</div>
                <div><span className="font-medium">Format:</span> {book.format || 'N/A'}</div>
                <div><span className="font-medium">Categories:</span> {book.categories?.join(', ') || 'N/A'}</div>
                <div><span className="font-medium">Stock:</span> {book.stock} available</div>
                {book.isbn && <div><span className="font-medium">ISBN:</span> {book.isbn}</div>}
                {book.edition && <div><span className="font-medium">Edition:</span> {book.edition}</div>}
                {book.series?.name && <div><span className="font-medium">Series:</span> {book.series.name} #{book.series.number}</div>}
                {book.tags?.length > 0 && <div className="col-span-2"><span className="font-medium">Tags:</span> {book.tags.join(', ')}</div>}
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