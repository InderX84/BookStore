import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ordersService } from '../services/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Checkout() {
  const [cartItems, setCartItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  
  const { register, handleSubmit, formState: { errors } } = useForm()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    
    const items = JSON.parse(localStorage.getItem('cart') || '[]')
    if (items.length === 0) {
      navigate('/cart')
      return
    }
    setCartItems(items)
  }, [isAuthenticated, navigate])

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const gst = total * 0.18 // 18% GST
  const finalTotal = total + gst

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const orderData = {
        items: cartItems.map(item => ({
          bookId: item.bookId,
          quantity: item.quantity
        })),
        paymentMethod: data.paymentMethod,
        shippingAddress: {
          street: data.street,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country || 'IN'
        }
      }

      console.log('Order data being sent:', orderData)
      const response = await ordersService.createOrder(orderData)
      localStorage.removeItem('cart')
      navigate(`/order-success?orderId=${response.data._id}`)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Order failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <input
                      {...register('street', { required: 'Street is required' })}
                      placeholder="Street Address"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.street && <p className="text-red-600 text-sm mt-1">{errors.street.message}</p>}
                  </div>
                  
                  <div>
                    <input
                      {...register('city', { required: 'City is required' })}
                      placeholder="City"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city.message}</p>}
                  </div>
                  
                  <div>
                    <input
                      {...register('state', { required: 'State is required' })}
                      placeholder="State"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.state && <p className="text-red-600 text-sm mt-1">{errors.state.message}</p>}
                  </div>
                  
                  <div>
                    <input
                      {...register('zipCode', { required: 'Pincode is required' })}
                      placeholder="Pincode"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.zipCode && <p className="text-red-600 text-sm mt-1">{errors.zipCode.message}</p>}
                  </div>
                  
                  <div>
                    <select
                      {...register('country')}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="IN">India</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      {...register('paymentMethod', { required: 'Payment method required' })}
                      type="radio"
                      value="upi"
                      className="mr-3"
                    />
                    UPI
                  </label>
                  <label className="flex items-center">
                    <input
                      {...register('paymentMethod')}
                      type="radio"
                      value="credit_card"
                      className="mr-3"
                    />
                    Credit Card
                  </label>
                  <label className="flex items-center">
                    <input
                      {...register('paymentMethod')}
                      type="radio"
                      value="net_banking"
                      className="mr-3"
                    />
                    Net Banking
                  </label>
                  <label className="flex items-center">
                    <input
                      {...register('paymentMethod')}
                      type="radio"
                      value="cod"
                      className="mr-3"
                    />
                    Cash on Delivery
                  </label>
                </div>
                {errors.paymentMethod && <p className="text-red-600 text-sm mt-1">{errors.paymentMethod.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : 'Place Order'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6 h-fit">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-2 mb-4">
              {cartItems.map(item => (
                <div key={item.bookId} className="flex justify-between text-sm">
                  <span>{item.title} × {item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>GST (18%):</span>
                <span>₹{gst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span className="text-blue-600">₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}