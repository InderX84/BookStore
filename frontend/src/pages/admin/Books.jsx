import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit, Trash2, Search, X, Save } from 'lucide-react'
import { booksService, adminService } from '../../services/api'
import toast from 'react-hot-toast'

export default function AdminBooks() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [editingBook, setEditingBook] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    description: '',
    isbn: '',
    isbn13: '',
    edition: '',
    format: 'Paperback',
    price: '',
    originalPrice: '',
    discount: '0',
    stock: '',
    availability: 'In Stock',
    categories: '',
    publisher: '',
    publishedDate: '',
    language: 'English',
    ageGroup: '',
    pages: '',
    tags: '',
    series: { name: '', number: '' },
    featured: false,
    bestseller: false,
    images: [{ url: '' }]
  })
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-books', { search, page }],
    queryFn: () => booksService.getBooks({ search, page, limit: 10 }),
    select: data => data.data
  })

  const createMutation = useMutation({
    mutationFn: (bookData) => adminService.createBook(bookData),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-books'])
      toast.success('Book created successfully')
      resetForm()
    },
    onError: (error) => {
      console.error('Create book error:', error.response?.data)
      console.error('Validation details:', error.response?.data?.details)
      toast.error(error.response?.data?.details?.[0] || error.response?.data?.message || 'Failed to create book')
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, bookData }) => adminService.updateBook(id, bookData),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-books'])
      toast.success('Book updated successfully')
      resetForm()
    },
    onError: () => {
      toast.error('Failed to update book')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => adminService.deleteBook(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-books'])
      toast.success('Book deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete book')
    }
  })

  const resetForm = () => {
    setFormData({
      title: '',
      authors: '',
      description: '',
      isbn: '',
      isbn13: '',
      edition: '',
      format: 'Paperback',
      price: '',
      originalPrice: '',
      discount: '0',
      stock: '',
      availability: 'In Stock',
      categories: '',
      publisher: '',
      publishedDate: '',
      language: 'English',
      ageGroup: '',
      pages: '',
      tags: '',
      series: { name: '', number: '' },
      featured: false,
      bestseller: false,
      images: [{ url: '' }]
    })
    setShowForm(false)
    setEditingBook(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const bookData = {
      title: formData.title,
      authors: formData.authors.split(',').map(a => a.trim()).filter(a => a),
      description: formData.description,
      categories: [formData.categories].filter(c => c),
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      currency: 'INR',
      format: formData.format,
      availability: formData.availability,
      language: formData.language,
      discount: parseFloat(formData.discount),
      featured: formData.featured,
      bestseller: formData.bestseller
    }

    // Optional fields
    if (formData.isbn) bookData.isbn = formData.isbn
    if (formData.isbn13) bookData.isbn13 = formData.isbn13
    if (formData.edition) bookData.edition = formData.edition
    if (formData.originalPrice) bookData.originalPrice = parseFloat(formData.originalPrice)
    if (formData.publisher) bookData.publisher = formData.publisher
    if (formData.publishedDate) bookData.publishedDate = formData.publishedDate
    if (formData.ageGroup) bookData.ageGroup = formData.ageGroup
    if (formData.pages) bookData.pages = parseInt(formData.pages)
    if (formData.tags) bookData.tags = formData.tags.split(',').map(t => t.trim()).filter(t => t)
    if (formData.series.name) bookData.series = { name: formData.series.name, number: parseInt(formData.series.number) || 1 }
    if (formData.images[0]?.url && formData.images[0].url.trim()) {
      bookData.images = [{ url: formData.images[0].url.trim() }]
    }

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
      isbn: book.isbn || '',
      isbn13: book.isbn13 || '',
      edition: book.edition || '',
      format: book.format || 'Paperback',
      price: book.price.toString(),
      originalPrice: book.originalPrice?.toString() || '',
      discount: book.discount?.toString() || '0',
      stock: book.stock.toString(),
      availability: book.availability || 'In Stock',
      categories: book.categories[0] || '',
      publisher: book.publisher || '',
      publishedDate: book.publishedDate ? book.publishedDate.split('T')[0] : '',
      language: book.language || 'English',
      ageGroup: book.ageGroup || '',
      pages: book.pages?.toString() || '',
      tags: book.tags?.join(', ') || '',
      series: { name: book.series?.name || '', number: book.series?.number?.toString() || '' },
      featured: book.featured || false,
      bestseller: book.bestseller || false,
      images: book.images || [{ url: '' }]
    })
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this book?')) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Books</h1>
          <button 
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Book
          </button>
        </div>

        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {editingBook ? 'Edit Book' : 'Add New Book'}
                </h2>
                <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-medium mb-3">Basic Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Title *</label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Authors * (comma separated)</label>
                      <input
                        type="text"
                        required
                        value={formData.authors}
                        onChange={(e) => setFormData({...formData, authors: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Description *</label>
                      <textarea
                        required
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Publication Details */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-medium mb-3">Publication Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">ISBN</label>
                      <input
                        type="text"
                        value={formData.isbn}
                        onChange={(e) => setFormData({...formData, isbn: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">ISBN-13</label>
                      <input
                        type="text"
                        value={formData.isbn13}
                        onChange={(e) => setFormData({...formData, isbn13: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Publisher</label>
                      <input
                        type="text"
                        value={formData.publisher}
                        onChange={(e) => setFormData({...formData, publisher: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Published Date</label>
                      <input
                        type="date"
                        value={formData.publishedDate}
                        onChange={(e) => setFormData({...formData, publishedDate: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Edition</label>
                      <input
                        type="text"
                        value={formData.edition}
                        onChange={(e) => setFormData({...formData, edition: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Pages</label>
                      <input
                        type="number"
                        value={formData.pages}
                        onChange={(e) => setFormData({...formData, pages: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Classification */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-medium mb-3">Classification</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Category *</label>
                      <select
                        required
                        value={formData.categories}
                        onChange={(e) => setFormData({...formData, categories: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select a category</option>
                        <option value="Fiction">Fiction</option>
                        <option value="Non-Fiction">Non-Fiction</option>
                        <option value="Mystery">Mystery</option>
                        <option value="Romance">Romance</option>
                        <option value="Sci-Fi">Sci-Fi</option>
                        <option value="Fantasy">Fantasy</option>
                        <option value="Biography">Biography</option>
                        <option value="History">History</option>
                        <option value="Science">Science</option>
                        <option value="Technology">Technology</option>
                        <option value="Business">Business</option>
                        <option value="Self-Help">Self-Help</option>
                        <option value="Children">Children</option>
                        <option value="Young Adult">Young Adult</option>
                        <option value="Poetry">Poetry</option>
                        <option value="Drama">Drama</option>
                        <option value="Punjabi Literature">Punjabi Literature</option>
                        <option value="Indian Poetry">Indian Poetry</option>
                        <option value="Partition Literature">Partition Literature</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Language</label>
                      <select
                        value={formData.language}
                        onChange={(e) => setFormData({...formData, language: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="English">English</option>
                        <option value="Hindi">Hindi</option>
                        <option value="Bengali">Bengali</option>
                        <option value="Telugu">Telugu</option>
                        <option value="Marathi">Marathi</option>
                        <option value="Tamil">Tamil</option>
                        <option value="Gujarati">Gujarati</option>
                        <option value="Urdu">Urdu</option>
                        <option value="Kannada">Kannada</option>
                        <option value="Malayalam">Malayalam</option>
                        <option value="Punjabi">Punjabi</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Age Group</label>
                      <select
                        value={formData.ageGroup}
                        onChange={(e) => setFormData({...formData, ageGroup: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select age group</option>
                        <option value="Children (0-12)">Children (0-12)</option>
                        <option value="Young Adult (13-17)">Young Adult (13-17)</option>
                        <option value="Adult (18+)">Adult (18+)</option>
                        <option value="All Ages">All Ages</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Format</label>
                      <select
                        value={formData.format}
                        onChange={(e) => setFormData({...formData, format: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Paperback">Paperback</option>
                        <option value="Hardcover">Hardcover</option>
                        <option value="eBook">eBook</option>
                        <option value="Audiobook">Audiobook</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({...formData, tags: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      placeholder="bestseller, award-winning, classic"
                    />
                  </div>
                </div>

                {/* Pricing & Inventory */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-medium mb-3">Pricing & Inventory</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Price (INR) *</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Original Price (INR)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.originalPrice}
                        onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Discount (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={formData.discount}
                        onChange={(e) => setFormData({...formData, discount: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Stock *</label>
                      <input
                        type="number"
                        required
                        value={formData.stock}
                        onChange={(e) => setFormData({...formData, stock: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Availability</label>
                      <select
                        value={formData.availability}
                        onChange={(e) => setFormData({...formData, availability: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="In Stock">In Stock</option>
                        <option value="Out of Stock">Out of Stock</option>
                        <option value="Pre-order">Pre-order</option>
                        <option value="Coming Soon">Coming Soon</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-medium mb-3">Additional Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Series Name</label>
                      <input
                        type="text"
                        value={formData.series.name}
                        onChange={(e) => setFormData({...formData, series: {...formData.series, name: e.target.value}})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Series Number</label>
                      <input
                        type="number"
                        value={formData.series.number}
                        onChange={(e) => setFormData({...formData, series: {...formData.series, number: e.target.value}})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">Image URL</label>
                    <input
                      type="url"
                      value={formData.images[0]?.url || ''}
                      onChange={(e) => setFormData({...formData, images: [{url: e.target.value}]})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="mt-4 flex gap-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                        className="mr-2"
                      />
                      Featured Book
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
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center disabled:opacity-50"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {editingBook ? 'Update' : 'Create'} Book
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search books..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Books Table */}
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
                          <div className="flex items-center">
                            <img
                              src={book.images?.[0]?.url || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=60&h=80&fit=crop'}
                              alt={book.title}
                              className="w-12 h-16 object-cover rounded mr-4"
                            />
                            <div>
                              <div className="font-semibold">{book.title}</div>
                              <div className="text-sm text-gray-600">{book.categories.join(', ')}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">{book.authors.join(', ')}</td>
                        <td className="py-4 px-6">₹{book.price.toFixed(2)}</td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            book.stock > 10 ? 'bg-green-100 text-green-800' :
                            book.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {book.stock} in stock
                          </span>
                        </td>
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
              </div>

              {/* Pagination */}
              {data?.totalPages > 1 && (
                <div className="flex justify-center py-4">
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
            </>
          )}
        </div>
      </div>
    </div>
  )
}