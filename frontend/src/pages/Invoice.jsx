import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Download, Printer } from 'lucide-react'
import { ordersService } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Invoice() {
  const { id } = useParams()
  const { user } = useAuth()

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersService.getOrder(id),
    select: data => data.data
  })

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // In a real app, this would generate and download a PDF
    handlePrint()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Invoice not found</h2>
          <p className="text-gray-600">The invoice you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const gst = subtotal * 0.18
  const total = subtotal + gst

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Print/Download Actions */}
        <div className="flex justify-end gap-4 mb-6 print:hidden">
          <button
            onClick={handlePrint}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </button>
        </div>

        {/* Invoice */}
        <div className="bg-white rounded-lg shadow-md p-8 print:shadow-none print:rounded-none">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-blue-600 mb-2">BookStore</h1>
              <div className="text-sm text-gray-600">
                <p>123 Book Street</p>
                <p>Mumbai, Maharashtra 400001</p>
                <p>India</p>
                <p>GST: 27AABCU9603R1ZX</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold mb-2">INVOICE</h2>
              <div className="text-sm">
                <p><span className="font-medium">Invoice #:</span> INV-{order._id.slice(-8)}</p>
                <p><span className="font-medium">Order #:</span> {order._id.slice(-8)}</p>
                <p><span className="font-medium">Date:</span> {new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
              </div>
            </div>
          </div>

          {/* Bill To */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">Bill To:</h3>
            <div className="text-sm">
              <p className="font-medium">{user?.name}</p>
              <p>{user?.email}</p>
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
              <p>{order.shippingAddress.zipCode}, {order.shippingAddress.country}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2 text-left">Item</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Qty</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Rate (₹)</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-4 py-2">
                      {item.book?.title || 'Book'}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {item.quantity}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-right">
                      {item.price.toFixed(2)}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-right">
                      {(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-64">
              <div className="flex justify-between py-2">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span>GST (18%):</span>
                <span>₹{gst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-t font-bold text-lg">
                <span>Total:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">Payment Information:</h3>
            <div className="text-sm">
              <p><span className="font-medium">Payment Method:</span> {order.paymentMethod.replace('_', ' ').toUpperCase()}</p>
              <p><span className="font-medium">Payment Status:</span> {order.status === 'completed' ? 'Paid' : 'Pending'}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-600 border-t pt-4">
            <p>Thank you for your business!</p>
            <p>For any queries, contact us at support@bookstore.com or +91-9876543210</p>
          </div>
        </div>
      </div>
    </div>
  )
}