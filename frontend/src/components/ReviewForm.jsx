import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Star } from 'lucide-react'
import { reviewsService } from '../services/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function ReviewForm({ bookId }) {
  const [rating, setRating] = useState(0)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()

  const createReviewMutation = useMutation({
    mutationFn: (reviewData) => reviewsService.createReview(bookId, reviewData),
    onSuccess: () => {
      queryClient.invalidateQueries(['book-reviews', bookId])
      queryClient.invalidateQueries(['book', bookId])
      toast.success('Review added successfully')
      setRating(0)
      setTitle('')
      setBody('')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to add review')
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast.error('Please login to add a review')
      return
    }
    createReviewMutation.mutate({ rating, title, body })
  }

  if (!isAuthenticated) return null

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
              >
                <Star className="h-6 w-6 fill-current" />
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Review</label>
          <textarea
            required
            rows={4}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <button
          type="submit"
          disabled={createReviewMutation.isPending || rating === 0}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {createReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  )
}