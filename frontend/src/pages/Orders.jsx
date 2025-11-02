import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Package, Eye } from 'lucide-react'
import { ordersService } from '../services/api'

export default function Orders() {
  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ['orders'],
    queryFn: () => ordersService.getOrders(),
    select: data => Array.isArray(data.data) ? data.data : []
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'shipped': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 flex items-center">
          <Package className="h-8 w-8 mr-3" />
          My Orders
        </h1>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">Error loading orders</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-4">Start shopping to see your orders here.</p>
            <Link to="/books" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Browse Books
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">Order #{order._id.slice(-8)}</h3>
                    <p className="text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <p className="text-lg font-bold mt-1">₹{order.total}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Items ({order.items.length})</h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <span className="font-medium">{item.bookId?.title || 'Book'}</span>
                          <span className="text-gray-600 ml-2">x{item.quantity}</span>
                        </div>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Payment: {order.paymentInfo?.method}</p>
                      <p className="text-sm text-gray-600">
                        Shipping: {order.shippingAddress.city}, {order.shippingAddress.state}
                      </p>
                    </div>
                    <Link 
                      to={`/orders/${order._id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}