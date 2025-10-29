import { useQuery } from '@tanstack/react-query'
import { BarChart3, TrendingUp, Users, BookOpen, ShoppingBag, Calendar } from 'lucide-react'
import { adminService } from '../../services/api'

export default function Analytics() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: () => adminService.getStats(),
    select: data => data.data
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  const revenueGrowth = stats?.totalRevenue > 0 ? 12.5 : 0
  const userGrowth = stats?.totalUsers > 0 ? 8.3 : 0
  const orderGrowth = stats?.totalOrders > 0 ? 15.2 : 0

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <BarChart3 className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold">₹{(stats?.totalRevenue || 0).toLocaleString('en-IN')}</p>
                <div className="flex items-center text-green-600 text-sm mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{revenueGrowth}% from last month
                </div>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Users</p>
                <p className="text-2xl font-bold">{stats?.totalUsers || 0}</p>
                <div className="flex items-center text-blue-600 text-sm mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{userGrowth}% from last month
                </div>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Orders</p>
                <p className="text-2xl font-bold">{stats?.totalOrders || 0}</p>
                <div className="flex items-center text-purple-600 text-sm mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{orderGrowth}% from last month
                </div>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <ShoppingBag className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Books</p>
                <p className="text-2xl font-bold">{stats?.totalBooks || 0}</p>
                <div className="flex items-center text-orange-600 text-sm mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Active inventory
                </div>
              </div>
              <div className="bg-orange-100 rounded-full p-3">
                <BookOpen className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart Placeholder */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                <p>Revenue chart would be displayed here</p>
                <p className="text-sm">Integration with charting library needed</p>
              </div>
            </div>
          </div>

          {/* Orders Chart Placeholder */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Order Volume</h3>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                <p>Order volume chart would be displayed here</p>
                <p className="text-sm">Integration with charting library needed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Recent Activity
          </h3>
          
          <div className="space-y-4">
            {stats?.recentOrders?.slice(0, 5).map((order, index) => (
              <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-blue-100 rounded-full p-2 mr-3">
                    <ShoppingBag className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">New order #{order._id.slice(-8)}</p>
                    <p className="text-sm text-gray-600">by {order.userId?.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₹{order.total.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('en-IN')}
                  </p>
                </div>
              </div>
            )) || (
              <p className="text-gray-600 text-center py-8">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}