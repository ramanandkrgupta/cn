'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  // Values stored in the database: discountedPrice and originalPrice
  const [discountedPrice, setDiscountedPrice] = useState('') // Price after discount
  const [originalPrice, setOriginalPrice] = useState('') // Full/original price

  // Derived field: discountPercentage
  const [discountPercentage, setDiscountPercentage] = useState('')

  // Which field should be computed?
  // Options: "discountPercentage", "originalPrice", "discountedPrice"
  const [computedField, setComputedField] = useState('discountPercentage')

  const [loading, setLoading] = useState(false)

  // Fetch current Pro plan settings on component mount.
  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/v1/members/settings/subscription')
        if (!res.ok) {
          throw new Error('Failed to fetch settings')
        }
        const data = await res.json()
        // Expected data: { discountedPrice, originalPrice, discountPercentage }
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

  // Live calculation effect.
  useEffect(() => {
    if (computedField === 'discountPercentage') {
      // Compute discount percentage from discountedPrice and originalPrice
      if (discountedPrice.trim() !== '' && originalPrice.trim() !== '') {
        const d = parseFloat(discountedPrice)
        const o = parseFloat(originalPrice)
        if (!isNaN(d) && !isNaN(o) && o !== 0) {
          const computedDiscount = ((o - d) / o) * 100
          const computedStr = computedDiscount.toFixed(2)
          if (computedStr !== discountPercentage) {
            setDiscountPercentage(computedStr)
          }
        } else {
          if (discountPercentage !== '') setDiscountPercentage('')
        }
      } else {
        if (discountPercentage !== '') setDiscountPercentage('')
      }
    } else if (computedField === 'originalPrice') {
      // Compute originalPrice from discountedPrice and discountPercentage
      if (discountedPrice.trim() !== '' && discountPercentage.trim() !== '') {
        const d = parseFloat(discountedPrice)
        const dp = parseFloat(discountPercentage)
        if (!isNaN(d) && !isNaN(dp) && dp < 100) {
          const computedOriginal = d / (1 - dp / 100)
          const computedStr = computedOriginal.toFixed(2)
          if (computedStr !== originalPrice) {
            setOriginalPrice(computedStr)
          }
        } else {
          if (originalPrice !== '') setOriginalPrice('')
        }
      } else {
        if (originalPrice !== '') setOriginalPrice('')
      }
    } else if (computedField === 'discountedPrice') {
      // Compute discountedPrice from originalPrice and discountPercentage
      if (originalPrice.trim() !== '' && discountPercentage.trim() !== '') {
        const o = parseFloat(originalPrice)
        const dp = parseFloat(discountPercentage)
        if (!isNaN(o) && !isNaN(dp)) {
          const computedDiscounted = o * (1 - dp / 100)
          const computedStr = computedDiscounted.toFixed(2)
          if (computedStr !== discountedPrice) {
            setDiscountedPrice(computedStr)
          }
        } else {
          if (discountedPrice !== '') setDiscountedPrice('')
        }
      } else {
        if (discountedPrice !== '') setDiscountedPrice('')
      }
    }
  }, [computedField, discountedPrice, originalPrice, discountPercentage])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Save discountedPrice and originalPrice (discountPercentage is derived)
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
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Subscription Settings</h1>

      {/* Radio buttons to select which field is computed */}
      <div className="mb-6">
        <label className="block font-medium mb-1">
          Select field to compute:
        </label>
        <div className="flex gap-4">
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name="computedField"
              value="discountPercentage"
              checked={computedField === 'discountPercentage'}
              onChange={(e) => setComputedField(e.target.value)}
            />
            Discount Percentage
          </label>
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name="computedField"
              value="originalPrice"
              checked={computedField === 'originalPrice'}
              onChange={(e) => setComputedField(e.target.value)}
            />
            Original Price
          </label>
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name="computedField"
              value="discountedPrice"
              checked={computedField === 'discountedPrice'}
              onChange={(e) => setComputedField(e.target.value)}
            />
            Discounted Price
          </label>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="discountedPrice" className="block font-medium mb-1">
            Discounted Price (INR)
          </label>
          <input
            type="number"
            id="discountedPrice"
            value={discountedPrice}
            onChange={(e) => setDiscountedPrice(e.target.value)}
            disabled={computedField === 'discountedPrice'}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter discounted price"
            required={computedField !== 'discountedPrice'}
          />
        </div>
        <div>
          <label htmlFor="originalPrice" className="block font-medium mb-1">
            Original Price (INR)
          </label>
          <input
            type="number"
            id="originalPrice"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
            disabled={computedField === 'originalPrice'}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter original price"
            required={computedField !== 'originalPrice'}
          />
        </div>
        <div>
          <label
            htmlFor="discountPercentage"
            className="block font-medium mb-1"
          >
            Discount Percentage (%)
          </label>
          <input
            type="number"
            id="discountPercentage"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(e.target.value)}
            disabled={computedField === 'discountPercentage'}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter discount percentage"
            required={computedField !== 'discountPercentage'}
          />
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? 'Updating...' : 'Update Settings'}
        </button>
      </form>
    </div>
  )
}
