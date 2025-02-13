'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  // State and logic remain unchanged
  const [discountedPrice, setDiscountedPrice] = useState('')
  const [originalPrice, setOriginalPrice] = useState('')
  const [discountPercentage, setDiscountPercentage] = useState('')
  const [computedField, setComputedField] = useState('discountPercentage')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/v1/members/settings/subscription')
        if (!res.ok) throw new Error('Failed to fetch settings')
        const data = await res.json()
        setDiscountedPrice(data.discountedPrice.toString())
        setOriginalPrice(data.originalPrice.toString())
        setDiscountPercentage(data.discountPercentage.toString())
      } catch (error) {
        console.error(error)
        toast.error('Failed to load subscription settings')
      }
    }
    fetchSettings()
  }, [])

  useEffect(() => {
    if (computedField === 'discountPercentage') {
      if (discountedPrice.trim() !== '' && originalPrice.trim() !== '') {
        const d = parseFloat(discountedPrice)
        const o = parseFloat(originalPrice)
        if (!isNaN(d) && !isNaN(o) && o !== 0) {
          const computed = (((o - d) / o) * 100).toFixed(2)
          if (computed !== discountPercentage) {
            setDiscountPercentage(computed)
          }
        } else if (discountPercentage !== '') {
          setDiscountPercentage('')
        }
      } else if (discountPercentage !== '') {
        setDiscountPercentage('')
      }
    } else if (computedField === 'originalPrice') {
      if (discountedPrice.trim() !== '' && discountPercentage.trim() !== '') {
        const d = parseFloat(discountedPrice)
        const dp = parseFloat(discountPercentage)
        if (!isNaN(d) && !isNaN(dp) && dp < 100) {
          const computed = (d / (1 - dp / 100)).toFixed(2)
          if (computed !== originalPrice) {
            setOriginalPrice(computed)
          }
        } else if (originalPrice !== '') {
          setOriginalPrice('')
        }
      } else if (originalPrice !== '') {
        setOriginalPrice('')
      }
    } else if (computedField === 'discountedPrice') {
      if (originalPrice.trim() !== '' && discountPercentage.trim() !== '') {
        const o = parseFloat(originalPrice)
        const dp = parseFloat(discountPercentage)
        if (!isNaN(o) && !isNaN(dp)) {
          const computed = (o * (1 - dp / 100)).toFixed(2)
          if (computed !== discountedPrice) {
            setDiscountedPrice(computed)
          }
        } else if (discountedPrice !== '') {
          setDiscountedPrice('')
        }
      } else if (discountedPrice !== '') {
        setDiscountedPrice('')
      }
    }
  }, [computedField, discountedPrice, originalPrice, discountPercentage])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/v1/admin/settings/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          discountedPrice: Number(discountedPrice),
          originalPrice: Number(originalPrice),
        }),
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to update settings')
      }
      toast.success('Subscription settings updated successfully!')
    } catch (error) {
      console.error(error)
      toast.error('Failed to update settings')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen bg-black p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-orange-500">
        Subscription Settings
      </h1>

      {/* Computation Selector */}
      <div className="w-full bg-gray-900 shadow-lg rounded-xl p-6 mb-8 border border-orange-500/30">
        <label className="block font-medium mb-4 text-orange-500">
          Select field to compute:
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['discountPercentage', 'originalPrice', 'discountedPrice'].map(
            (field) => (
              <label
                key={field}
                className={`flex items-center p-3 rounded-lg border transition-all ${
                  computedField === field
                    ? 'border-orange-500 bg-orange-500/10'
                    : 'border-gray-700 hover:border-orange-400'
                }`}
              >
                <input
                  type="radio"
                  name="computedField"
                  value={field}
                  checked={computedField === field}
                  onChange={(e) => setComputedField(e.target.value)}
                  className="h-4 w-4 text-orange-500 focus:ring-orange-500"
                />
                <span className="ml-3 text-gray-200 capitalize">
                  {field.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </label>
            )
          )}
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full space-y-6 bg-gray-900 shadow-lg rounded-xl p-6 border border-orange-500/30"
      >
        <div>
          <label
            htmlFor="discountedPrice"
            className="block font-medium mb-3 text-orange-500"
          >
            Discounted Price (INR)
          </label>
          <input
            type="number"
            id="discountedPrice"
            value={discountedPrice}
            onChange={(e) => setDiscountedPrice(e.target.value)}
            disabled={computedField === 'discountedPrice'}
            placeholder="Enter discounted price"
            required={computedField !== 'discountedPrice'}
            className="w-full bg-gray-800 text-gray-200 rounded-lg border border-gray-700 px-4 py-3 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50 placeholder-gray-500"
          />
        </div>
        <div>
          <label
            htmlFor="originalPrice"
            className="block font-medium mb-3 text-orange-500"
          >
            Original Price (INR)
          </label>
          <input
            type="number"
            id="originalPrice"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
            disabled={computedField === 'originalPrice'}
            placeholder="Enter original price"
            required={computedField !== 'originalPrice'}
            className="w-full bg-gray-800 text-gray-200 rounded-lg border border-gray-700 px-4 py-3 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50 placeholder-gray-500"
          />
        </div>
        <div>
          <label
            htmlFor="discountPercentage"
            className="block font-medium mb-3 text-orange-500"
          >
            Discount Percentage (%)
          </label>
          <input
            type="number"
            id="discountPercentage"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(e.target.value)}
            disabled={computedField === 'discountPercentage'}
            placeholder="Enter discount percentage"
            required={computedField !== 'discountPercentage'}
            className="w-full bg-gray-800 text-gray-200 rounded-lg border border-gray-700 px-4 py-3 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50 placeholder-gray-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-orange-600 text-black rounded-lg font-bold hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Updating...' : 'Update Settings'}
        </button>
      </form>
    </div>
  )
}
