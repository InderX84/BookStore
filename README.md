# BookStore - Modern Online Bookstore Application

A comprehensive, full-stack online bookstore built with the MERN stack, featuring modern UI/UX design and localized features for the Indian market.

## 🚀 Features

### User Features
- **Modern Authentication** - Secure JWT-based registration, login, logout with refresh tokens
- **Enhanced Book Catalog** - Browse, search, and filter books with star ratings and modern card design
- **Smart Shopping Cart** - Real-time cart badge, quantity management, and persistent storage
- **Order Management** - Complete order flow with Indian payment methods (UPI, Net Banking, COD)
- **Professional Invoices** - GST-compliant invoices with detailed breakdowns
- **Modern UI/UX** - Gradient backgrounds, hover animations, and responsive design

### Admin Features
- **Modern Admin Dashboard** - Comprehensive statistics with gradient design
- **Advanced Book Management** - Add, edit, delete books with modern modal forms
- **Category Management** - Organize books with enhanced category system
- **Order Management** - Track and update order status with modern interface
- **User Management** - View and manage users with detailed modal views
- **Bulk Import System** - CSV and JSON bulk import for books and categories

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

### Modern UI/UX Design
- Gradient backgrounds and modern color schemes
- Smooth hover animations and transitions
- Card-based layouts with rounded corners
- Responsive design with enhanced mobile experience
- Modern modal designs with backdrop blur effects

### Enhanced Authentication & Security
- JWT-based authentication with refresh tokens
- Password hashing with bcryptjs
- Protected routes and role-based access
- Input validation with Joi
- Secure cart management with real-time updates

### Advanced E-commerce Features
- Smart shopping cart with badge notifications
- Star rating system for books
- Enhanced book detail pages with wishlist/share options
- Modern checkout flow with Indian payment methods
- Professional invoice generation with GST calculations

### Modern Admin Management
- Redesigned admin dashboard with gradient themes
- Enhanced CRUD operations with modern modals
- Transparent modal backgrounds for better UX
- Advanced bulk import with CSV/JSON support
- Comprehensive user and order management

### Indian Market Optimization
- INR currency with proper formatting
- Indian payment methods integration
- GST calculation (18%) on all orders
- Regional language support
- Curated Punjabi literature collection

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

## 📈 Recent Updates & Future Enhancements

### Recent Updates
- ✅ Modern gradient UI design implementation
- ✅ Enhanced book cards with star ratings
- ✅ Improved admin panel with modern modals
- ✅ Real-time cart badge notifications
- ✅ Transparent modal backgrounds
- ✅ Enhanced book detail pages
- ✅ Modern profile management layout

### Future Enhancements
- Payment gateway integration (Razorpay/Stripe)
- Real-time notifications with WebSocket
- AI-powered book recommendations
- Progressive Web App (PWA) support
- Advanced analytics dashboard
- Multi-language interface
- Inventory management system
- Social features (reviews, ratings, sharing)

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

**Note**: This is a modern, comprehensive e-commerce solution designed specifically for the Indian market, featuring cutting-edge UI/UX design, advanced functionality, and localized features built with the latest web technologies.

## 🎨 Design Highlights

- **Modern Gradient Themes** - Beautiful blue-to-indigo gradients throughout
- **Enhanced Cards** - Rounded corners, shadows, and hover animations
- **Smart Interactions** - Real-time cart updates and smooth transitions
- **Professional Modals** - Gradient headers with transparent backgrounds
- **Responsive Layout** - Optimized for all device sizes
- **Accessibility** - WCAG compliant design patterns