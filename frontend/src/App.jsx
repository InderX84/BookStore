import { Routes, Route, useLocation } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'

// Lazy loaded pages
const Home = lazy(() => import('./pages/Home'))
const Books = lazy(() => import('./pages/Books'))
const BookDetail = lazy(() => import('./pages/BookDetail'))
const Cart = lazy(() => import('./pages/Cart'))
const Checkout = lazy(() => import('./pages/Checkout'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Profile = lazy(() => import('./pages/Profile'))
const Orders = lazy(() => import('./pages/Orders'))
const OrderDetail = lazy(() => import('./pages/OrderDetail'))
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'))
const Invoice = lazy(() => import('./pages/Invoice'))
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'))
const AdminBooks = lazy(() => import('./pages/admin/Books'))
const AdminOrders = lazy(() => import('./pages/admin/Orders'))
const AdminUsers = lazy(() => import('./pages/admin/Users'))
const AdminCategories = lazy(() => import('./pages/admin/Categories'))
const BulkImport = lazy(() => import('./pages/admin/BulkImport'))
const Analytics = lazy(() => import('./pages/admin/Analytics'))
const NotFound = lazy(() => import('./pages/NotFound'))

function App() {
  const location = useLocation()
  const hideNavFooter = ['/login', '/register'].includes(location.pathname)

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col">
        {!hideNavFooter && <Navbar />}
        <main className={hideNavFooter ? '' : 'flex-1'}>
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          }>
            <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<Books />} />
          <Route path="/books/:id" element={<BookDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/cart" element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          } />
          <Route path="/orders/:id" element={
            <ProtectedRoute>
              <OrderDetail />
            </ProtectedRoute>
          } />
          <Route path="/order-success" element={
            <ProtectedRoute>
              <OrderSuccess />
            </ProtectedRoute>
          } />
          <Route path="/invoice/:id" element={
            <ProtectedRoute>
              <Invoice />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/books" element={
            <ProtectedRoute adminOnly>
              <AdminBooks />
            </ProtectedRoute>
          } />
          <Route path="/admin/orders" element={
            <ProtectedRoute adminOnly>
              <AdminOrders />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute adminOnly>
              <AdminUsers />
            </ProtectedRoute>
          } />
          <Route path="/admin/categories" element={
            <ProtectedRoute adminOnly>
              <AdminCategories />
            </ProtectedRoute>
          } />
          <Route path="/admin/bulk-import" element={
            <ProtectedRoute adminOnly>
              <BulkImport />
            </ProtectedRoute>
          } />
          <Route path="/admin/analytics" element={
            <ProtectedRoute adminOnly>
              <Analytics />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        {!hideNavFooter && <Footer />}
      </div>
    </ErrorBoundary>
  )
}

export default App