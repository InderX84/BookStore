import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Package, Calendar } from 'lucide-react'
import { ordersService } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Orders() {
  const { isAuthenticated } = useAuth()

  const { data, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => ordersService.getOrders(),
    select: data => data.data.orders,
    enabled: isAuthenticated
  })

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Please login</h2>
          <p className="text-gray-600">You need to login to view your orders.</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        {data?.length === 0 ? (
          <div className="text-center py-16">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
            <p className="text-gray-600">Your orders will appear here once you make a purchase.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {data?.map(order => (
              <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">Order #{order._id.slice(-8)}</h3>
                    <div className="flex items-center text-gray-600 text-sm mt-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">₹{order.total.toFixed(2)}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                      {order.status === 'completed' && (
                        <Link
                          to={`/invoice/${order._id}`}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200"
                        >
                          Invoice
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {order.items.map(item => (
                    <div key={item._id} className="flex justify-between text-sm">
                      <span>{item.book?.title || 'Book'} × {item.quantity}</span>
                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}