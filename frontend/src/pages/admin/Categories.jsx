import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit, Trash2, X, Save } from 'lucide-react'
import { adminService } from '../../services/api'
import toast from 'react-hot-toast'

export default function AdminCategories() {
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [formData, setFormData] = useState({ name: '', description: '' })
  const queryClient = useQueryClient()

  const { data: categories, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => adminService.getCategories(),
    select: data => data.data
  })

  const createMutation = useMutation({
    mutationFn: (categoryData) => adminService.createCategory(categoryData),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-categories'])
      toast.success('Category created')
      resetForm()
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create category')
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, categoryData }) => adminService.updateCategory(id, categoryData),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-categories'])
      toast.success('Category updated')
      resetForm()
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update category')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => adminService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-categories'])
      toast.success('Category deleted')
    },
    onError: (error) => {
      console.log('Delete error:', error.response?.data)
      toast.error(error.response?.data?.message || 'Failed to delete category')
    }
  })

  const resetForm = () => {
    setFormData({ name: '', description: '' })
    setShowForm(false)
    setEditingCategory(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory._id, categoryData: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  const handleEdit = (category) => {
    setEditingCategory(category)
    setFormData({ name: category.name, description: category.description || '' })
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (confirm('Delete this category?')) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">
                  {editingCategory ? 'Edit Category' : 'Add Category'}
                </h2>
                <button onClick={resetForm} className="text-white hover:text-gray-200">
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6">

            <form id="category-form" onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <input
                  type="text"
                  required
                  maxLength={50}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  rows={3}
                  maxLength={200}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

            </form>
            </div>
            <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex gap-3">
              <button
                type="submit"
                form="category-form"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center disabled:opacity-50 font-medium"
              >
                <Save className="h-4 w-4 mr-2" />
                {editingCategory ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={resetForm}
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {categories?.map(category => (
              <div key={category._id} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{category.name}</h3>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => handleEdit(category)}
                      className="text-blue-600 hover:text-blue-700 p-1"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(category._id)}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {category.description && (
                  <p className="text-gray-600 text-sm mb-2">{category.description}</p>
                )}
                <div className="text-xs text-gray-500">
                  {category.bookCount || 0} books
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
  )
}