import { useQuery } from '@tanstack/react-query'
import { Star, User } from 'lucide-react'
import { reviewsService } from '../services/api'

export default function ReviewsList({ bookId }) {
  const { data, isLoading } = useQuery({
    queryKey: ['book-reviews', bookId],
    queryFn: () => reviewsService.getBookReviews(bookId),
    select: data => data.data
  })

  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
  }

  if (!data?.reviews?.length) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-600">No reviews yet. Be the first to review this book!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Customer Reviews ({data.total})</h3>
      {data.reviews.map(review => (
        <div key={review._id} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 rounded-full p-2">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">{review.user?.name}</p>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <span className="text-sm text-gray-500">
              {new Date(review.createdAt).toLocaleDateString('en-IN')}
            </span>
          </div>
          
          <h4 className="font-semibold mb-2">{review.title}</h4>
          <p className="text-gray-700">{review.body}</p>
        </div>
      ))}
    </div>
  )
}