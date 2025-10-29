import User from '../models/User.js';
import Book from '../models/Book.js';
import Order from '../models/Order.js';

export const getPublicStats = async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    
    res.json({
      totalBooks,
      totalUsers,
      totalOrders
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};