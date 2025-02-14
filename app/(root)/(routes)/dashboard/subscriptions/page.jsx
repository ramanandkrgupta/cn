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
} from 'lucide-react'

const SubscriptionsPage = () => {
  const [subscriptions, setSubscriptions] = useState([])
  const router = useRouter()

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await fetch('/api/v1/admin/subscriptions') // Create this API to fetch subscriptions
        const data = await response.json()
        setSubscriptions(data)
      } catch (error) {
        console.error('Error fetching subscriptions:', error)
      }
    }
    fetchSubscriptions()
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-200 text-black' // Light green for active subscriptions
      case 'pending':
        return 'bg-yellow-200 text-black' // Light yellow for pending subscriptions
      case 'failed':
        return 'bg-red-200 text-black' // Light red for failed subscriptions
      default:
        return 'bg-gray-200 text-black' // Default gray for unknown status
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-orange-400">User Subscriptions</h1>

      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
            <thead className="bg-gray-300">
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
                    {sub.paymentId}
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
            <p>
              <strong>Payment ID:</strong> {sub.paymentId}
            </p>
            <p>
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
