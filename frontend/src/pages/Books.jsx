import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, Filter, X, Star } from 'lucide-react'
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Discover Amazing Books</h1>
          <p className="text-gray-600 text-lg">Find your next favorite read from our curated collection</p>
        </div>
        
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
            <div className="bg-white rounded-xl shadow-lg p-6">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
              {data?.books?.map(book => (
                <Link
                  key={book._id}
                  to={`/books/${book._id}`}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 group hover:-translate-y-2"
                >
                  <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl mb-4 overflow-hidden">
                    <img
                      src={book.images?.[0]?.url || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop'}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-lg">{book.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{book.authors.join(', ')}</p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-blue-600 font-bold text-xl">₹{book.price.toFixed(2)}</p>
                      {book.ratingAvg > 0 && (
                        <div className="flex items-center text-yellow-500">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="text-sm ml-1 font-medium">{book.ratingAvg.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    {(book.featured || book.bestseller) && (
                      <div className="flex gap-2 flex-wrap">
                        {book.featured && <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">Featured</span>}
                        {book.bestseller && <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">Bestseller</span>}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {data?.totalPages > 1 && (
              <div className="flex justify-center gap-3">
                {Array.from({ length: data.totalPages }, (_, i) => i + 1).map(pageNum => (
                  <button
                    key={pageNum}
                    onClick={() => {
                      const params = new URLSearchParams(searchParams)
                      params.set('page', pageNum.toString())
                      setSearchParams(params)
                    }}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      pageNum === page
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-blue-50 shadow-md'
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