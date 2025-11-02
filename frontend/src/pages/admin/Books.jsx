import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit, Trash2, X, Save } from 'lucide-react'
import { booksService, adminService } from '../../services/api'
import toast from 'react-hot-toast'



export default function AdminBooks() {
  const [showForm, setShowForm] = useState(false)
  const [editingBook, setEditingBook] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    description: '',
    categories: [],
    price: '',
    stock: '',
    isbn: '',
    publisher: '',
    language: 'English',
    format: 'Paperback',
    pages: '',
    imageUrl: '',
    featured: false,
    bestseller: false
  })
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-books'],
    queryFn: () => booksService.getBooks({ limit: 50 }),
    select: data => data.data
  })

  const { data: categories } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => adminService.getCategories(),
    select: data => data.data
  })

  const createMutation = useMutation({
    mutationFn: (bookData) => adminService.createBook(bookData),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-books'])
      toast.success('Book created')
      resetForm()
    },
    onError: (error) => {
      console.log('Create error:', error.response?.data)
      toast.error(error.response?.data?.details?.[0] || error.response?.data?.message || 'Failed to create book')
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, bookData }) => adminService.updateBook(id, bookData),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-books'])
      toast.success('Book updated')
      resetForm()
    },
    onError: () => toast.error('Failed to update book')
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => adminService.deleteBook(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-books'])
      toast.success('Book deleted')
    },
    onError: () => toast.error('Failed to delete book')
  })

  const resetForm = () => {
    setFormData({
      title: '',
      authors: '',
      description: '',
      categories: [],
      price: '',
      stock: '',
      isbn: '',
      publisher: '',
      language: 'English',
      format: 'Paperback',
      pages: '',
      imageUrl: '',
      featured: false,
      bestseller: false
    })
    setShowForm(false)
    setEditingBook(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (formData.categories.length === 0) {
      toast.error('Select at least one category')
      return
    }

    const authors = formData.authors.split(',').map(a => a.trim()).filter(a => a)
    if (authors.length === 0) {
      toast.error('At least one author is required')
      return
    }

    const bookData = {
      title: formData.title.trim(),
      authors: authors,
      description: formData.description.trim(),
      categories: formData.categories,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      language: formData.language,
      format: formData.format,
      featured: formData.featured,
      bestseller: formData.bestseller
    }

    if (formData.isbn) bookData.isbn = formData.isbn.trim()
    if (formData.publisher) bookData.publisher = formData.publisher.trim()
    if (formData.pages) bookData.pages = parseInt(formData.pages)
    if (formData.imageUrl) bookData.images = [{ url: formData.imageUrl.trim() }]

    if (editingBook) {
      updateMutation.mutate({ id: editingBook._id, bookData })
    } else {
      createMutation.mutate(bookData)
    }
  }

  const handleEdit = (book) => {
    setEditingBook(book)
    setFormData({
      title: book.title,
      authors: book.authors.join(', '),
      description: book.description,
      categories: book.categories,
      price: book.price.toString(),
      stock: book.stock.toString(),
      isbn: book.isbn || '',
      publisher: book.publisher || '',
      language: book.language || 'English',
      format: book.format || 'Paperback',
      pages: book.pages?.toString() || '',
      imageUrl: book.images?.[0]?.url || '',
      featured: book.featured || false,
      bestseller: book.bestseller || false
    })
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (confirm('Delete this book?')) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Books</h1>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Book
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingBook ? 'Edit Book' : 'Add Book'}
              </h2>
              <button onClick={resetForm}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Authors * (comma separated)</label>
                <input
                  type="text"
                  required
                  value={formData.authors}
                  onChange={(e) => setFormData({...formData, authors: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Categories *</label>
                <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto border rounded p-2">
                  {categories?.map(category => (
                    <label key={category._id} className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={formData.categories.includes(category.name)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({...formData, categories: [...formData.categories, category.name]})
                          } else {
                            setFormData({...formData, categories: formData.categories.filter(c => c !== category.name)})
                          }
                        }}
                        className="mr-2"
                      />
                      {category.name}
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Stock *</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">ISBN</label>
                  <input
                    type="text"
                    value={formData.isbn}
                    onChange={(e) => setFormData({...formData, isbn: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Publisher</label>
                  <input
                    type="text"
                    value={formData.publisher}
                    onChange={(e) => setFormData({...formData, publisher: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Language</label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({...formData, language: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Punjabi">Punjabi</option>
                    <option value="Bengali">Bengali</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Format</label>
                  <select
                    value={formData.format}
                    onChange={(e) => setFormData({...formData, format: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="Paperback">Paperback</option>
                    <option value="Hardcover">Hardcover</option>
                    <option value="eBook">eBook</option>
                    <option value="Audiobook">Audiobook</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Pages</label>
                  <input
                    type="number"
                    value={formData.pages}
                    onChange={(e) => setFormData({...formData, pages: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Image URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  placeholder="https://example.com/book-cover.jpg"
                />
              </div>

              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                    className="mr-2"
                  />
                  Featured
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.bestseller}
                    onChange={(e) => setFormData({...formData, bestseller: e.target.checked})}
                    className="mr-2"
                  />
                  Bestseller
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center disabled:opacity-50"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {editingBook ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6">Book</th>
                <th className="text-left py-3 px-6">Authors</th>
                <th className="text-left py-3 px-6">Price</th>
                <th className="text-left py-3 px-6">Stock</th>
                <th className="text-left py-3 px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.books?.map(book => (
                <tr key={book._id} className="border-b">
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-semibold">{book.title}</div>
                      <div className="text-sm text-gray-600">{book.categories.join(', ')}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">{book.authors.join(', ')}</td>
                  <td className="py-4 px-6">₹{book.price}</td>
                  <td className="py-4 px-6">{book.stock}</td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEdit(book)}
                        className="text-blue-600 hover:text-blue-700 p-1"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(book._id)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}