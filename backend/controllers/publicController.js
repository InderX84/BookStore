import User from '../models/User.js';
import Book from '../models/Book.js';
import Order from '../models/Order.js';

export const getPublicStats = async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    
    const revenueResult = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;
    
    const avgRatingResult = await Book.aggregate([
      { $match: { ratingAvg: { $gt: 0 } } },
      { $group: { _id: null, avgRating: { $avg: '$ratingAvg' } } }
    ]);
    const avgRating = avgRatingResult[0]?.avgRating || 4.8;
    
    res.json({
      totalBooks,
      totalUsers,
      totalOrders,
      totalRevenue,
      avgRating: Number(avgRating.toFixed(1))
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};