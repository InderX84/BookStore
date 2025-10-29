# BookStore - Online Bookstore Application

A comprehensive, full-stack online bookstore built with the MERN stack, designed for the Indian market with localized features.

## 🚀 Features

### User Features
- **User Authentication** - Secure JWT-based registration, login, logout
- **Book Catalog** - Browse, search, and filter books with advanced options
- **Shopping Cart** - Add books with quantity management and real-time updates
- **Order Management** - Place orders with Indian payment methods (UPI, Net Banking, COD)
- **Invoice System** - Professional invoices with GST calculations
- **Responsive Design** - Optimized for desktop and mobile devices

### Admin Features
- **Admin Dashboard** - Comprehensive statistics and management overview
- **Book Management** - Add, edit, delete books with detailed information
- **Category Management** - Organize books with custom categories
- **Order Management** - Track and update order status
- **User Management** - View and manage registered users
- **Bulk Import** - CSV-based bulk import for books and categories

### Indian Market Features
- **INR Currency** - All pricing in Indian Rupees
- **GST Integration** - 18% GST calculation on orders
- **Indian Payment Methods** - UPI, Net Banking, Credit/Debit Cards, COD
- **Indian Languages** - Support for Hindi, Punjabi, Bengali, and other regional languages
- **Punjabi Literature** - Dedicated section for Punjabi books and poetry

## 🛠 Tech Stack

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT Authentication** with refresh tokens
- **bcryptjs** for password hashing
- **Joi** for input validation
- **Multer** for file uploads
- **CSV Parser** for bulk imports

### Frontend
- **React 18** with modern hooks
- **React Router** for navigation
- **React Query** for server state management
- **React Hook Form** for form handling
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Hot Toast** for notifications

## 📋 Prerequisites

- Node.js 18+
- MongoDB 7+
- Git

## 🚀 Installation & Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd book-store
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run seed    # Populate with sample data
npm run dev     # Start development server
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev     # Start development server
```

### 4. Access Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## 👥 Demo Accounts

After running the seed script:

- **Admin**: admin@bookstore.com / admin123
- **User**: john@example.com / password123

## 📚 Sample Data

The seed script includes:
- **English Books**: Classic literature and modern titles
- **Punjabi Literature**: Pinjar, Khooni Vaisakhi, Heer Ranjha
- **Categories**: Fiction, Poetry, History, Punjabi Literature
- **Users**: Admin and regular user accounts

## 🔗 API Endpoints

### Public Endpoints
- `GET /api/public/stats` - Public statistics
- `GET /api/books` - Browse books
- `GET /api/books/:id` - Book details

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - User logout

### Protected Endpoints
- `POST /api/orders` - Create order
- `GET /api/orders` - User orders
- `POST /api/reviews/:bookId` - Add review

### Admin Endpoints
- `GET /api/admin/stats` - Admin statistics
- `POST /api/admin/bulk-import/:type` - Bulk import
- `GET /api/admin/template/:type` - Download templates

## ⚙️ Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bookstore
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 📁 Project Structure

```
book-store/
├── backend/
│   ├── controllers/        # Business logic
│   │   ├── authController.js
│   │   ├── bookController.js
│   │   ├── orderController.js
│   │   ├── adminController.js
│   │   └── bulkImportController.js
│   ├── models/            # Database schemas
│   │   ├── User.js
│   │   ├── Book.js
│   │   ├── Order.js
│   │   └── Category.js
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── utils/            # Helper functions
│   └── scripts/          # Database scripts
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   │   ├── admin/    # Admin pages
│   │   │   └── ...       # User pages
│   │   ├── context/      # React context
│   │   ├── services/     # API services
│   │   └── hooks/        # Custom hooks
│   └── public/           # Static assets
└── README.md
```

## 🎯 Key Features Implemented

### Authentication & Security
- JWT-based authentication with refresh tokens
- Password hashing with bcryptjs
- Protected routes and role-based access
- Input validation with Joi

### E-commerce Functionality
- Shopping cart with localStorage persistence
- Order placement with Indian payment methods
- Invoice generation with GST calculations
- Order tracking and status updates

### Admin Management
- Comprehensive dashboard with real-time statistics
- CRUD operations for books, categories, users
- Bulk import functionality with CSV support
- Order management with status updates

### Indian Localization
- INR currency throughout the application
- Indian payment methods integration
- GST calculation (18%) on all orders
- Support for Indian languages
- Punjabi literature collection

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests (if implemented)
cd frontend
npm test
```

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Build and deploy to your preferred platform
3. Ensure MongoDB connection is configured

### Frontend Deployment
1. Build the React application
2. Deploy to static hosting service
3. Update API URL in environment variables

## 📈 Future Enhancements

- Payment gateway integration
- Real-time notifications
- Advanced search with filters
- Book recommendations
- Mobile application
- Multi-language support
- Inventory management
- Sales analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Add tests for new features
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

Final Year Project - Computer Science Engineering
Online Bookstore Management System

---

**Note**: This is a comprehensive e-commerce solution designed specifically for the Indian market with localized features and modern web technologies.