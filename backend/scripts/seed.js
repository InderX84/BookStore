import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Book from '../models/Book.js';
import Category from '../models/Category.js';

dotenv.config();

const sampleBooks = [
  {
    title: "The Great Gatsby",
    authors: ["F. Scott Fitzgerald"],
    description: "A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream.",
    categories: ["Fiction"],
    price: 975,
    stock: 50,
    publisher: "Scribner",
    language: "English",
    pages: 180,
    ratingAvg: 4.2,
    ratingCount: 1250
  },
  {
    title: "Pinjar",
    authors: ["Amrita Pritam"],
    description: "ਇੱਕ ਦਰਦਨਾਕ ਕਹਾਣੀ ਜੋ ਵੰਡ ਦੇ ਸਮੇਂ ਔਰਤਾਂ ਦੇ ਦੁੱਖਾਂ ਨੂੰ ਦਰਸਾਉਂਦੀ ਹੈ। A heart-wrenching story depicting women's suffering during partition.",
    categories: ["Fiction"],
    price: 450,
    stock: 25,
    publisher: "Navyug Publishers",
    language: "English",
    pages: 156,
    ratingAvg: 4.6,
    ratingCount: 890,
    featured: true
  },
  {
    title: "Khooni Vaisakhi",
    authors: ["Nanak Singh"],
    description: "ਜਲਿਆਂਵਾਲਾ ਬਾਗ਼ ਹੱਤਿਆਕਾਂਡ ਦੀ ਦਰਦਨਾਕ ਕਹਾਣੀ। A painful account of the Jallianwala Bagh massacre.",
    categories: ["History"],
    price: 350,
    stock: 30,
    publisher: "Lahore Book Shop",
    language: "English",
    pages: 98,
    ratingAvg: 4.8,
    ratingCount: 1200,
    bestseller: true
  },
  {
    title: "Suraj de Sputtar",
    authors: ["Kartar Singh Duggal"],
    description: "ਪੰਜਾਬੀ ਸਾਹਿਤ ਦੀ ਇੱਕ ਮਹਾਨ ਰਚਨਾ। A masterpiece of Punjabi literature exploring human relationships.",
    categories: ["Fiction"],
    price: 525,
    stock: 20,
    publisher: "Punjabi Sahit Akademi",
    language: "English",
    pages: 245,
    ratingAvg: 4.4,
    ratingCount: 650
  },
  {
    title: "Birha Tu Sultan",
    authors: ["Waris Shah"],
    description: "ਹੀਰ ਰਾਂਝਾ ਦੀ ਅਮਰ ਪ੍ਰੇਮ ਕਹਾਣੀ। The immortal love story of Heer Ranjha in classical Punjabi poetry.",
    categories: ["Poetry"],
    price: 675,
    stock: 15,
    publisher: "Punjabi University",
    language: "English",
    pages: 312,
    ratingAvg: 4.9,
    ratingCount: 2100,
    featured: true
  },
  {
    title: "Ajj Aakhaan Waris Shah Nu",
    authors: ["Amrita Pritam"],
    description: "ਵੰਡ ਦੇ ਦਰਦ ਨੂੰ ਬਿਆਨ ਕਰਦੀ ਇੱਕ ਮਹਾਨ ਕਵਿਤਾ। A powerful poem expressing the pain of partition.",
    categories: ["Poetry"],
    price: 275,
    stock: 40,
    publisher: "Raj Kamal Prakashan",
    language: "English",
    pages: 45,
    ratingAvg: 4.7,
    ratingCount: 1500
  },
  {
    title: "1984",
    authors: ["George Orwell"],
    description: "A dystopian social science fiction novel about totalitarian control and surveillance.",
    categories: ["Fiction"],
    price: 1050,
    stock: 40,
    publisher: "Secker & Warburg",
    language: "English",
    pages: 328,
    ratingAvg: 4.4,
    ratingCount: 1800
  },
  {
    title: "Harry Potter and the Sorcerer's Stone",
    authors: ["J.K. Rowling"],
    description: "The first book in the beloved fantasy series about a young wizard's adventures.",
    categories: ["Fantasy"],
    price: 1200,
    stock: 60,
    publisher: "Bloomsbury",
    language: "English",
    pages: 309,
    ratingAvg: 4.7,
    ratingCount: 3200
  }
];

const sampleCategories = [
  { name: 'Punjabi Literature', description: 'Books in Punjabi language covering various genres' },
  { name: 'Indian Poetry', description: 'Classical and modern poetry from Indian subcontinent' },
  { name: 'Partition Literature', description: 'Literature depicting the 1947 partition of India' }
];

const sampleUsers = [
  {
    name: "Admin User",
    email: "admin@bookstore.com",
    passwordHash: "admin123",
    role: "admin"
  },
  {
    name: "John Doe",
    email: "john@example.com",
    passwordHash: "password123",
    role: "user"
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Book.deleteMany({});
    await Category.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    for (const userData of sampleUsers) {
      const hashedPassword = await bcrypt.hash(userData.passwordHash, 12);
      await User.create({
        ...userData,
        passwordHash: hashedPassword
      });
    }
    console.log('Created sample users');

    // Create categories
    await Category.insertMany(sampleCategories);
    console.log('Created sample categories');

    // Create books
    await Book.insertMany(sampleBooks);
    console.log('Created sample books');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();