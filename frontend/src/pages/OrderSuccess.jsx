import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { CheckCircle, Package, ArrowRight } from 'lucide-react'
import { ordersService } from '../services/api'

export default function OrderSuccess() {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('orderId')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (orderId) {
      ordersService.getOrder(orderId)
        .then(response => {
          setOrder(response.data)
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [orderId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Thank You!</h1>
          <p className="text-gray-600 mb-6">Your order has been placed successfully.</p>
          
          {order && (
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Order ID:</span>
                  <span>#{order._id.slice(-8)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Total Amount:</span>
                  <span className="text-lg font-bold">₹{order.total}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Items:</span>
                  <span>{order.items.length} book(s)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Status:</span>
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="text-left">
                <h3 className="font-medium mb-2">Items Ordered:</h3>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span>{item.bookId?.title || item.title} x{item.quantity}</span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <div className="flex gap-4 justify-center mt-6">
            <Link 
              to="/orders" 
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 flex items-center"
            >
              <Package className="h-4 w-4 mr-2" />
              View Orders
            </Link>
            <Link 
              to="/books" 
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400 flex items-center"
            >
              Continue Shopping
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}