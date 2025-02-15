'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  User,
  CreditCard,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Copy,
  Check,
} from 'lucide-react'
import toast from 'react-hot-toast'

const SubscriptionsPage = () => {
  const [subscriptions, setSubscriptions] = useState([])
  const [copiedId, setCopiedId] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await fetch('/api/v1/admin/subscriptions')
        if (!response.ok) {
          throw new Error('Failed to fetch subscriptions')
        }
        const data = await response.json()
        setSubscriptions(data)
      } catch (error) {
        console.error('Error fetching subscriptions:', error)
        toast.error('Failed to load subscriptions')
      }
    }
    fetchSubscriptions()
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-200 text-black'
      case 'pending':
        return 'bg-yellow-200 text-black'
      case 'failed':
        return 'bg-red-200 text-black'
      default:
        return 'bg-gray-200 text-black'
    }
  }

  const copyToClipboard = (paymentId) => {
    navigator.clipboard
      .writeText(paymentId)
      .then(() => {
        setCopiedId(paymentId)
        toast.success('Payment ID copied!')
        setTimeout(() => setCopiedId(null), 2000)
      })
      .catch((err) => {
        console.error('Failed to copy: ', err)
        toast.error('Failed to copy Payment ID')
      })
  }

  const CopyButton = ({ paymentId }) => {
    const isCopied = copiedId === paymentId

    return (
      <div className="relative group">
        <button
          className={`ml-2 p-1 rounded-md transition-all duration-200 ${
            isCopied
              ? 'bg-green-100 text-green-600'
              : 'hover:bg-gray-100 text-gray-600 hover:text-blue-600'
          }`}
          onClick={() => copyToClipboard(paymentId)}
          aria-label={isCopied ? 'Copied!' : 'Copy to clipboard'}
        >
          {isCopied ? <Check size={16} /> : <Copy size={16} />}
        </button>
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 hidden group-hover:block">
          <div className="bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
            {isCopied ? 'Copied!' : 'Copy ID'}
          </div>
          <div className="w-2 h-2 bg-gray-800 transform rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-orange-400">
        User Subscriptions
      </h1>

      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-4 py-2 text-left text-black">
                  User Name
                </th>
                <th className="border px-4 py-2 text-left text-black">
                  Payment ID
                </th>
                <th className="border px-4 py-2 text-left text-black">
                  Order Status
                </th>
                <th className="border px-4 py-2 text-left text-black">
                  Subscription End
                </th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((sub) => (
                <tr
                  key={sub.id}
                  className={`border ${getStatusColor(sub.orderStatus)}`}
                >
                  <td className="border px-4 py-2 text-black">
                    {sub.user.name}
                  </td>
                  <td className="border px-4 py-2 text-black">
                    <div className="flex items-center">
                      <div className="flex items-center bg-gray-50 rounded-lg px-3 py-1">
                        <code className="text-sm font-mono text-blue-600">
                          {sub.paymentId}
                        </code>
                        <CopyButton paymentId={sub.paymentId} />
                      </div>
                    </div>
                  </td>
                  <td className="border px-4 py-2 text-black">
                    {sub.orderStatus}
                  </td>
                  <td className="border px-4 py-2 text-black">
                    {new Date(sub.subscriptionEnd).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile View */}
      <div className="block md:hidden">
        {subscriptions.map((sub) => (
          <div
            key={sub.id}
            className={`border ${getStatusColor(
              sub.orderStatus
            )} p-4 mb-4 rounded-lg`}
          >
            <h2 className="font-bold text-lg">{sub.user.name}</h2>
            <div className="flex items-center mt-2">
              <div className="flex items-center bg-gray-50 rounded-lg px-3 py-1">
                <code className="text-sm font-mono text-blue-600">
                  {sub.paymentId}
                </code>
                <CopyButton paymentId={sub.paymentId} />
              </div>
            </div>
            <p className="mt-2">
              <strong>Order Status:</strong> {sub.orderStatus}
            </p>
            <p>
              <strong>Subscription End:</strong>{' '}
              {new Date(sub.subscriptionEnd).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SubscriptionsPage
