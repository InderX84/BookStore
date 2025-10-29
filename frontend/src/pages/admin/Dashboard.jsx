import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { BookOpen, Users, ShoppingBag, TrendingUp, Package, Calendar, Plus, Edit, Eye, AlertTriangle, CheckCircle, Clock, Truck, Tag } from 'lucide-react'
import { adminService } from '../../services/api'

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => adminService.getStats(),
    select: data => data.data
  })

  const { data: users } = useQuery({
    queryKey: ['admin-users-preview'],
    queryFn: () => adminService.getUsers({ limit: 5 }),
    select: data => data.data
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'shipped': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-3">
            <Link to="/admin/books" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Book
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link to="/admin/books" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-full p-3 mr-4">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Books</p>
                <p className="text-2xl font-bold">{stats?.totalBooks || 0}</p>
                <p className="text-xs text-blue-600 mt-1">Manage Books →</p>
              </div>
            </div>
          </Link>

          <Link to="/admin/users" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="bg-green-100 rounded-full p-3 mr-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Users</p>
                <p className="text-2xl font-bold">{stats?.totalUsers || 0}</p>
                <p className="text-xs text-green-600 mt-1">Manage Users →</p>
              </div>
            </div>
          </Link>

          <Link to="/admin/orders" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="bg-purple-100 rounded-full p-3 mr-4">
                <ShoppingBag className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Orders</p>
                <p className="text-2xl font-bold">{stats?.totalOrders || 0}</p>
                <p className="text-xs text-purple-600 mt-1">Manage Orders →</p>
              </div>
            </div>
          </Link>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 rounded-full p-3 mr-4">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold">₹{(stats?.totalRevenue || 0).toLocaleString('en-IN')}</p>
                <p className="text-xs text-yellow-600 mt-1">This Month</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Recent Orders
              </h2>
              <Link to="/admin/orders" className="text-blue-600 hover:text-blue-800 text-sm">View All</Link>
            </div>
            
            {stats?.recentOrders?.length > 0 ? (
              <div className="space-y-3">
                {stats.recentOrders.map(order => (
                  <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="bg-blue-100 rounded-full p-2 mr-3">
                        <Package className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">#{order._id.slice(-8)}</p>
                        <p className="text-sm text-gray-600">{order.userId?.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{order.total.toFixed(2)}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">No recent orders</p>
            )}
          </div>

          {/* User Management Preview */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Recent Users
              </h2>
              <Link to="/admin/users" className="text-blue-600 hover:text-blue-800 text-sm">View All</Link>
            </div>
            
            {users?.users?.length > 0 ? (
              <div className="space-y-3">
                {users.users.map(user => (
                  <div key={user._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="bg-green-100 rounded-full p-2 mr-3">
                        <Users className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(user.createdAt).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">No users found</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/admin/books" className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h3 className="font-semibold">Manage Books</h3>
                <p className="text-sm text-gray-600">Add, edit, or remove books</p>
              </div>
            </Link>
            
            <Link to="/admin/orders" className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <ShoppingBag className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <h3 className="font-semibold">Process Orders</h3>
                <p className="text-sm text-gray-600">Update order status</p>
              </div>
            </Link>
            
            <Link to="/admin/categories" className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <Tag className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <h3 className="font-semibold">Manage Categories</h3>
                <p className="text-sm text-gray-600">Add and organize categories</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}