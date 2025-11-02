import Order from '../models/Order.js';
import Book from '../models/Book.js';

export const createOrder = async (req, res) => {
  try {
    console.log('Received order data:', req.body);
    const { items, paymentMethod, shippingAddress } = req.body;
    
    let subtotal = 0;
    const orderItems = [];
    
    for (const item of items) {
      console.log('Looking for book with ID:', item.bookId);
      const book = await Book.findById(item.bookId);
      console.log('Found book:', book ? book.title : 'NOT FOUND');
      if (!book) {
        return res.status(404).json({ message: `Book not found: ${item.bookId}` });
      }
      if (book.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${book.title}` });
      }
      
      const itemTotal = book.price * item.quantity;
      subtotal += itemTotal;
      
      orderItems.push({
        bookId: book._id,
        title: book.title,
        price: book.price,
        quantity: item.quantity
      });
      
      book.stock -= item.quantity;
      await book.save();
    }
    
    const gst = subtotal * 0.18; // 18% GST
    const shippingCost = 50; // Fixed shipping cost
    const totalAmount = subtotal + gst + shippingCost;
    
    const order = new Order({
      userId: req.user._id,
      items: orderItems,
      subtotal,
      tax: gst,
      shipping: shippingCost,
      total: totalAmount,
      paymentInfo: {
        method: paymentMethod,
        status: 'pending'
      },
      shippingAddress,
      status: 'pending'
    });
    
    await order.save();
    await order.populate('items.bookId');
    
    res.status(201).json(order);
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(400).json({ message: 'Order creation failed', error: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const orders = await Order.find({ userId: req.user._id })
      .populate('items.bookId')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Order.countDocuments({ userId: req.user._id });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    }).populate('items.bookId');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};