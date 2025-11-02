import Review from '../models/Review.js';
import Book from '../models/Book.js';

export const createReview = async (req, res) => {
  try {
    const { rating, title, body } = req.body;
    const bookId = req.params.bookId;
    
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    const existingReview = await Review.findOne({ 
      userId: req.user._id, 
      bookId: bookId 
    });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this book' });
    }
    
    const review = new Review({
      userId: req.user._id,
      bookId: bookId,
      rating,
      title,
      body
    });
    
    await review.save();
    await review.populate('userId', 'name');
    
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: 'Review creation failed', error: error.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const review = await Review.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    Object.assign(review, req.body);
    await review.save();
    await review.populate('userId', 'name');
    
    res.json(review);
  } catch (error) {
    res.status(400).json({ message: 'Review update failed', error: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getBookReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const bookId = req.params.bookId;
    
    const reviews = await Review.find({ bookId: bookId })
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Review.countDocuments({ bookId: bookId });
    
    res.json({
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};