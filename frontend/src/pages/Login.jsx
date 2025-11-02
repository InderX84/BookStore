import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, BookOpen, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { publicService } from '../services/api'

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [stats, setStats] = useState({ totalBooks: '10K+', totalUsers: '5K+', avgRating: '4.8⭐' })
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const from = location.state?.from?.pathname || '/'

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await publicService.getStats()
        const data = response.data
        setStats({
          totalBooks: data.totalBooks > 1000 ? `${Math.floor(data.totalBooks/1000)}K+` : data.totalBooks,
          totalUsers: data.totalUsers > 1000 ? `${Math.floor(data.totalUsers/1000)}K+` : data.totalUsers,
          avgRating: `${data.avgRating || 4.8}⭐`
        })
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      }
    }
    fetchStats()
  }, [])

  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      await login(data)
      toast.success('Login successful!')
      navigate(from, { replace: true })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-screen w-screen bg-gray-100 flex items-center justify-center overflow-hidden">
      <div className="max-w-4xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Left Panel - Login Form */}
            <div className="lg:w-1/2 p-8 lg:p-12">
              <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center mb-6">
                    <BookOpen className="h-10 w-10 text-blue-600 mr-3" />
                    <h1 className="text-3xl font-bold text-gray-900">BookStore</h1>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                  <p className="text-gray-600">Sign in to your account</p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        {...register('password', {
                          required: 'Password is required'
                        })}
                        type={showPassword ? 'text' : 'password'}
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors flex items-center justify-center"
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                    {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                      Sign up
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Right Panel - Branding */}
            <div className="lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 p-8 lg:p-12 flex items-center justify-center">
              <div className="text-center text-white">
                <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
                <p className="text-blue-100 mb-8 text-lg">
                  Continue your reading journey with thousands of books at your fingertips.
                </p>
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold">{stats.totalBooks}</div>
                    <div className="text-sm text-blue-200">Books</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stats.totalUsers}</div>
                    <div className="text-sm text-blue-200">Readers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stats.avgRating}</div>
                    <div className="text-sm text-blue-200">Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}