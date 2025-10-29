import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Users, Search, Filter, Calendar, Mail, Shield, User, Eye, UserX } from 'lucide-react'
import { adminService } from '../../services/api'
import toast from 'react-hot-toast'

export default function AdminUsers() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const queryClient = useQueryClient()

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1) // Reset to first page on search
    }, 500)
    return () => clearTimeout(timer)
  }, [search])

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', { page, search: debouncedSearch }],
    queryFn: () => adminService.getUsers({ page, limit: 10, search: debouncedSearch }),
    select: data => data.data
  })

  const suspendUserMutation = useMutation({
    mutationFn: (userId) => adminService.suspendUser(userId),
    onSuccess: () => {
      toast.success('User suspended successfully')
      queryClient.invalidateQueries(['admin-users'])
    },
    onError: () => {
      toast.error('Failed to suspend user')
    }
  })

  const getRoleColor = (role) => {
    return role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
  }

  const handleSuspendUser = (userId) => {
    if (window.confirm('Are you sure you want to suspend this user?')) {
      suspendUserMutation.mutate(userId)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center">
            <Users className="h-8 w-8 mr-3" />
            User Management
          </h1>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-6">User</th>
                      <th className="text-left py-3 px-6">Role</th>
                      <th className="text-left py-3 px-6">Joined</th>
                      <th className="text-left py-3 px-6">Status</th>
                      <th className="text-left py-3 px-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.users?.map(user => (
                      <tr key={user._id} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <div className="bg-blue-100 rounded-full p-2 mr-3">
                              <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-gray-600 flex items-center">
                                <Mail className="h-3 w-3 mr-1" />
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center w-fit ${getRoleColor(user.role)}`}>
                            <Shield className="h-3 w-3 mr-1" />
                            {user.role}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            {new Date(user.createdAt).toLocaleDateString('en-IN')}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.status === 'suspended' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {user.status === 'suspended' ? 'Suspended' : 'Active'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => setSelectedUser(user)}
                              className="text-blue-600 hover:text-blue-800 text-sm px-3 py-1 border border-blue-200 rounded hover:bg-blue-50 flex items-center"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </button>
                            {user.role !== 'admin' && (
                              <button 
                                onClick={() => handleSuspendUser(user._id)}
                                disabled={suspendUserMutation.isLoading}
                                className="text-red-600 hover:text-red-800 text-sm px-3 py-1 border border-red-200 rounded hover:bg-red-50 flex items-center disabled:opacity-50"
                              >
                                <UserX className="h-3 w-3 mr-1" />
                                {suspendUserMutation.isLoading 
                                  ? 'Processing...' 
                                  : user.status === 'suspended' 
                                    ? 'Activate' 
                                    : 'Suspend'
                                }
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {data?.totalPages > 1 && (
                <div className="flex justify-center py-4 border-t">
                  <div className="flex gap-2">
                    {Array.from({ length: data.totalPages }, (_, i) => i + 1).map(pageNum => (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`px-3 py-1 rounded ${
                          pageNum === page
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Summary */}
              <div className="bg-gray-50 px-6 py-3 text-sm text-gray-600">
                Showing {data?.users?.length || 0} of {data?.total || 0} users
              </div>
            </>
          )}
        </div>

        {/* User Details Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">User Details</h3>
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Name</label>
                  <p className="text-gray-900">{selectedUser.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-900">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Role</label>
                  <p className="text-gray-900 capitalize">{selectedUser.role}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Joined</label>
                  <p className="text-gray-900">{new Date(selectedUser.createdAt).toLocaleDateString('en-IN')}</p>
                </div>
                {selectedUser.phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone</label>
                    <p className="text-gray-900">{selectedUser.phone}</p>
                  </div>
                )}
                {selectedUser.address && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Address</label>
                    <p className="text-gray-900">{selectedUser.address.street}, {selectedUser.address.city}, {selectedUser.address.state} - {selectedUser.address.pincode}</p>
                  </div>
                )}
              </div>
              <div className="mt-6 flex justify-end">
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}