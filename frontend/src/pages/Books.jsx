import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, Filter, X } from 'lucide-react'
import { booksService } from '../services/api'

export default function Books() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  
  const search = searchParams.get('search') || ''
  const category = searchParams.get('category') || ''
  const sort = searchParams.get('sort') || 'createdAt'
  const order = searchParams.get('order') || 'desc'
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''
  const page = parseInt(searchParams.get('page')) || 1

  const { data, isLoading } = useQuery({
    queryKey: ['books', { search, category, sort, order, minPrice, maxPrice, page }],
    queryFn: () => booksService.getBooks({ search, category, sort, order, minPrice, maxPrice, page }),
    select: data => data.data
  })

  const updateSearch = (value) => {
    const params = new URLSearchParams(searchParams)
    if (value) params.set('search', value)
    else params.delete('search')
    params.set('page', '1')
    setSearchParams(params)
  }

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams)
    if (value) params.set(key, value)
    else params.delete(key)
    params.set('page', '1')
    setSearchParams(params)
  }

  const clearFilters = () => {
    setSearchParams({ search })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Books</h1>
        
        {/* Search & Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search books..."
                value={search}
                onChange={(e) => updateSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="h-5 w-5" />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => updateFilter('category', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Categories</option>
                    <option value="Fiction">Fiction</option>
                    <option value="Non-Fiction">Non-Fiction</option>
                    <option value="Poetry">Poetry</option>
                    <option value="History">History</option>
                    <option value="Punjabi Literature">Punjabi Literature</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Sort By</label>
                  <select
                    value={`${sort}-${order}`}
                    onChange={(e) => {
                      const [sortField, sortOrder] = e.target.value.split('-')
                      updateFilter('sort', sortField)
                      updateFilter('order', sortOrder)
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="createdAt-desc">Newest First</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="ratingAvg-desc">Highest Rated</option>
                    <option value="title-asc">Title: A to Z</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Min Price (₹)</label>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => updateFilter('minPrice', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Max Price (₹)</label>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => updateFilter('maxPrice', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="mt-4 flex justify-between">
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                >
                  <X className="h-4 w-4" />
                  Clear Filters
                </button>
                <span className="text-sm text-gray-600">
                  {data?.total || 0} books found
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Books Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {data?.books?.map(book => (
                <Link
                  key={book._id}
                  to={`/books/${book._id}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4"
                >
                  <div className="aspect-[3/4] bg-gray-200 rounded mb-4">
                    <img
                      src={book.images?.[0]?.url || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop'}
                      alt={book.title}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{book.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{book.authors.join(', ')}</p>
                  <div className="space-y-2">
                    <p className="text-blue-600 font-bold">₹{book.price.toFixed(2)}</p>
                    {(book.featured || book.bestseller) && (
                      <div className="flex gap-1">
                        {book.featured && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">Featured</span>}
                        {book.bestseller && <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Bestseller</span>}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {data?.totalPages > 1 && (
              <div className="flex justify-center gap-2">
                {Array.from({ length: data.totalPages }, (_, i) => i + 1).map(pageNum => (
                  <button
                    key={pageNum}
                    onClick={() => {
                      const params = new URLSearchParams(searchParams)
                      params.set('page', pageNum.toString())
                      setSearchParams(params)
                    }}
                    className={`px-4 py-2 rounded ${
                      pageNum === page
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}