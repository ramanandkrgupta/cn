'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const [planPrice, setPlanPrice] = useState('')
  const [ads, setAds] = useState([])
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(false)

  // Fetch settings on mount
  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/v1/admin/settings')
        if (!res.ok) throw new Error('Failed to fetch settings')
        const data = await res.json()
        setPlanPrice(data.planPrice)
        setAds(data.ads || [])
        setBanners(data.banners || [])
      } catch (error) {
        console.error(error)
        toast.error('Failed to load site settings')
      }
    }
    fetchSettings()
  }, [])

  // Handlers for Ads
  const handleAdChange = (index, field, value) => {
    const newAds = [...ads]
    newAds[index] = { ...newAds[index], [field]: value }
    setAds(newAds)
  }
  const addAd = () => setAds([...ads, { img: '', url: '', title: '' }])
  const removeAd = (index) => setAds(ads.filter((_, i) => i !== index))

  // Handlers for Banners
  const handleBannerChange = (index, field, value) => {
    const newBanners = [...banners]
    newBanners[index] = { ...newBanners[index], [field]: value }
    setBanners(newBanners)
  }
  const addBanner = () =>
    setBanners([
      ...banners,
      { src: '', srcLight: '', link: '', title: '', description: '', tag: '', buttonName: '' },
    ])
  const removeBanner = (index) => setBanners(banners.filter((_, i) => i !== index))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/v1/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planPrice: Number(planPrice),
          ads,
          banners,
        }),
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to update settings')
      }
      toast.success('Site settings updated successfully!')
    } catch (error) {
      console.error(error)
      toast.error(error.message || 'Failed to update settings')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Site Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Plan Price */}
        <div className="bg-white shadow rounded p-6">
          <h2 className="text-xl font-semibold mb-4">Plan Price</h2>
          <label className="block mb-2">
            <span className="block text-sm font-medium text-gray-700">Pro Plan Price (INR)</span>
            <input
              type="number"
              value={planPrice}
              onChange={(e) => setPlanPrice(e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter plan price"
              required
            />
          </label>
        </div>

        {/* Ads Section */}
        <div className="bg-white shadow rounded p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Ads</h2>
            <button type="button" onClick={addAd} className="text-blue-600 hover:underline">
              Add Ad
            </button>
          </div>
          {ads.length === 0 && <p className="text-gray-500">No ads added yet.</p>}
          {ads.map((ad, index) => (
            <div key={index} className="border rounded p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">Ad #{index + 1}</h3>
                <button type="button" onClick={() => removeAd(index)} className="text-red-600 hover:underline">
                  Remove
                </button>
              </div>
              <label className="block mb-2">
                <span className="block text-sm font-medium text-gray-700">Image URL</span>
                <input
                  type="text"
                  value={ad.img}
                  onChange={(e) => handleAdChange(index, 'img', e.target.value)}
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="/ads/ad1.jpg"
                />
              </label>
              <label className="block mb-2">
                <span className="block text-sm font-medium text-gray-700">Ad URL</span>
                <input
                  type="text"
                  value={ad.url}
                  onChange={(e) => handleAdChange(index, 'url', e.target.value)}
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="https://example.com/ad1?trace=ad1"
                />
              </label>
              <label className="block">
                <span className="block text-sm font-medium text-gray-700">Title</span>
                <input
                  type="text"
                  value={ad.title}
                  onChange={(e) => handleAdChange(index, 'title', e.target.value)}
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Ad Title"
                />
              </label>
            </div>
          ))}
        </div>

        {/* Banners Section */}
        <div className="bg-white shadow rounded p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Banners</h2>
            <button type="button" onClick={addBanner} className="text-blue-600 hover:underline">
              Add Banner
            </button>
          </div>
          {banners.length === 0 && <p className="text-gray-500">No banners added yet.</p>}
          {banners.map((banner, index) => (
            <div key={index} className="border rounded p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">Banner #{index + 1}</h3>
                <button type="button" onClick={() => removeBanner(index)} className="text-red-600 hover:underline">
                  Remove
                </button>
              </div>
              <label className="block mb-2">
                <span className="block text-sm font-medium text-gray-700">Image URL</span>
                <input
                  type="text"
                  value={banner.src}
                  onChange={(e) => handleBannerChange(index, 'src', e.target.value)}
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="https://..."
                />
              </label>
              <label className="block mb-2">
                <span className="block text-sm font-medium text-gray-700">Light Image URL</span>
                <input
                  type="text"
                  value={banner.srcLight}
                  onChange={(e) => handleBannerChange(index, 'srcLight', e.target.value)}
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="https://..."
                />
              </label>
              <label className="block mb-2">
                <span className="block text-sm font-medium text-gray-700">Link</span>
                <input
                  type="text"
                  value={banner.link}
                  onChange={(e) => handleBannerChange(index, 'link', e.target.value)}
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="https://..."
                />
              </label>
              <label className="block mb-2">
                <span className="block text-sm font-medium text-gray-700">Title</span>
                <input
                  type="text"
                  value={banner.title}
                  onChange={(e) => handleBannerChange(index, 'title', e.target.value)}
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Banner Title"
                />
              </label>
              <label className="block mb-2">
                <span className="block text-sm font-medium text-gray-700">Description</span>
                <textarea
                  value={banner.description}
                  onChange={(e) => handleBannerChange(index, 'description', e.target.value)}
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Banner description"
                ></textarea>
              </label>
              <label className="block mb-2">
                <span className="block text-sm font-medium text-gray-700">Tag</span>
                <input
                  type="text"
                  value={banner.tag}
                  onChange={(e) => handleBannerChange(index, 'tag', e.target.value)}
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Tag"
                />
              </label>
              <label className="block">
                <span className="block text-sm font-medium text-gray-700">Button Name</span>
                <input
                  type="text"
                  value={banner.buttonName}
                  onChange={(e) => handleBannerChange(index, 'buttonName', e.target.value)}
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Button text"
                />
              </label>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          {loading ? 'Updating...' : 'Update Settings'}
        </button>
      </form>
    </div>
  )
}
