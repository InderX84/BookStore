import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  authors: [{
    type: String,
    required: true,
    trim: true
  }],
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  isbn: {
    type: String,
    unique: true,
    sparse: true
  },
  isbn13: {
    type: String,
    unique: true,
    sparse: true
  },
  edition: {
    type: String,
    trim: true
  },
  format: {
    type: String,
    enum: ['Hardcover', 'Paperback', 'eBook', 'Audiobook'],
    default: 'Paperback'
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: {
      type: String,
      enum: ['cm', 'inch'],
      default: 'cm'
    }
  },
  weight: {
    value: Number,
    unit: {
      type: String,
      enum: ['g', 'kg', 'oz', 'lb'],
      default: 'g'
    }
  },
  categories: [{
    type: String,
    enum: ['Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Sci-Fi', 'Fantasy', 'Biography', 'History', 'Science', 'Technology', 'Business', 'Self-Help', 'Children', 'Young Adult', 'Poetry', 'Drama', 'Punjabi Literature', 'Indian Poetry', 'Partition Literature']
  }],
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  currency: {
    type: String,
    enum: ['INR', 'USD', 'EUR', 'GBP'],
    default: 'INR'
  },
  stock: {
    type: Number,
    required: [true, 'Stock is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  images: [{
    url: String,
    alt: String
  }],
  publishedDate: Date,
  publisher: String,
  language: {
    type: String,
    enum: ['English', 'Hindi', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Chinese', 'Japanese', 'Korean', 'Arabic', 'Bengali', 'Telugu', 'Marathi', 'Tamil', 'Gujarati', 'Urdu', 'Kannada', 'Malayalam', 'Punjabi'],
    default: 'English'
  },
  ageGroup: {
    type: String,
    enum: ['Children (0-12)', 'Young Adult (13-17)', 'Adult (18+)', 'All Ages']
  },
  tags: [{
    type: String,
    trim: true
  }],
  awards: [{
    name: String,
    year: Number
  }],
  series: {
    name: String,
    number: Number
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  discount: {
    type: Number,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%'],
    default: 0
  },
  availability: {
    type: String,
    enum: ['In Stock', 'Out of Stock', 'Pre-order', 'Coming Soon'],
    default: 'In Stock'
  },
  featured: {
    type: Boolean,
    default: false
  },
  bestseller: {
    type: Boolean,
    default: false
  },
  pages: {
    type: Number,
    min: [1, 'Pages must be at least 1']
  },
  ratingAvg: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  ratingCount: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

bookSchema.index({ title: 1 });
bookSchema.index({ authors: 1 });
bookSchema.index({ categories: 1 });
bookSchema.index({ price: 1 });
bookSchema.index({ ratingAvg: -1 });
bookSchema.index({ featured: -1 });
bookSchema.index({ bestseller: -1 });
bookSchema.index({ availability: 1 });

export default mongoose.model('Book', bookSchema);