import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Eye, Edit } from 'lucide-react'
import { adminService } from '../../services/api'
import toast from 'react-hot-toast'

export default function AdminOrders() {
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [newStatus, setNewStatus] = useState('')
  const queryClient = useQueryClient()

  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => adminService.getOrders(),
    select: data => Array.isArray(data?.data) ? data.data : []
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => adminService.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-orders'])
      toast.success('Order status updated')
      setSelectedOrder(null)
    },
    onError: () => toast.error('Failed to update status')
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

  const handleStatusUpdate = () => {
    if (selectedOrder && newStatus) {
      updateStatusMutation.mutate({ id: selectedOrder._id, status: newStatus })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Orders Management</h1>

        {/* Status Update Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-2xl">
                <h2 className="text-xl font-bold">Update Order Status</h2>
                <p className="text-purple-100 mt-1">Order #{selectedOrder._id.slice(-8)}</p>
              </div>
              <div className="p-6">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full border rounded-lg px-3 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Select Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex gap-3">
                <button
                  onClick={handleStatusUpdate}
                  disabled={!newStatus}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 font-medium"
                >
                  Update Status
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">Error loading orders</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6">Order ID</th>
                <th className="text-left py-3 px-6">Customer</th>
                <th className="text-left py-3 px-6">Date</th>
                <th className="text-left py-3 px-6">Items</th>
                <th className="text-left py-3 px-6">Total</th>
                <th className="text-left py-3 px-6">Status</th>
                <th className="text-left py-3 px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id} className="border-b">
                  <td className="py-4 px-6">#{order._id.slice(-8)}</td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium">{order.userId?.name}</div>
                      <div className="text-sm text-gray-600">{order.userId?.email}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {new Date(order.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td className="py-4 px-6">{order.items.length} items</td>
                  <td className="py-4 px-6">₹{order.total}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedOrder(order)
                          setNewStatus(order.status)
                        }}
                        className="text-blue-600 hover:text-blue-700 p-1"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

        {/* Order Details Section */}
        {orders.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Recent Order Details</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {orders.slice(0, 2).map(order => (
                <div key={order._id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold">Order #{order._id.slice(-8)}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <p><strong>Customer:</strong> {order.userId?.name}</p>
                  <p><strong>Email:</strong> {order.userId?.email}</p>
                  <p><strong>Payment:</strong> {order.paymentInfo?.method}</p>
                  <p><strong>Address:</strong> {order.shippingAddress.city}, {order.shippingAddress.state}</p>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium mb-2">Items:</h4>
                  <div className="space-y-1">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.bookId?.title} x{item.quantity}</span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t font-semibold">
                    Total: ₹{order.total}
                  </div>
                </div>
              </div>
            ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}