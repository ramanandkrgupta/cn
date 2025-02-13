'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  // State and logic remain unchanged
  const [planPrice, setPlanPrice] = useState('')
  const [ads, setAds] = useState([])
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(false)

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

  // Ads handlers
  const handleAdChange = (index, field, value) => {
    const newAds = [...ads]
    newAds[index] = { ...newAds[index], [field]: value }
    setAds(newAds)
  }
  const addAd = () => setAds([...ads, { img: '', url: '', title: '' }])
  const removeAd = (index) => setAds(ads.filter((_, i) => i !== index))

  // Banners handlers
  const handleBannerChange = (index, field, value) => {
    const newBanners = [...banners]
    newBanners[index] = { ...newBanners[index], [field]: value }
    setBanners(newBanners)
  }
  const addBanner = () =>
    setBanners([
      ...banners,
      {
        src: '',
        srcLight: '',
        link: '',
        title: '',
        description: '',
        tag: '',
        buttonName: '',
      },
    ])
  const removeBanner = (index) =>
    setBanners(banners.filter((_, i) => i !== index))

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
    <div className="w-full min-h-screen bg-black p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-orange-500">
        Site Settings
      </h1>
      <form onSubmit={handleSubmit} className="w-full space-y-8">
        {/* Plan Price Section */}
        <div className="w-full bg-gray-900 shadow-lg rounded-xl p-6 border border-orange-500/30">
          <h2 className="text-xl font-semibold mb-4 text-orange-500">
            Plan Price
          </h2>
          <input
            type="number"
            value={planPrice}
            onChange={(e) => setPlanPrice(e.target.value)}
            placeholder="Enter plan price"
            required
            className="w-full bg-gray-800 text-gray-200 rounded-lg border border-gray-700 px-4 py-3 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50 placeholder-gray-500"
          />
        </div>

        {/* Ads Section */}
        <div className="w-full bg-gray-900 shadow-lg rounded-xl p-6 border border-orange-500/30">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-orange-500">Ads</h2>
            <button
              type="button"
              onClick={addAd}
              className="bg-orange-600 text-black px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors"
            >
              Add Ad
            </button>
          </div>
          {ads.length === 0 && (
            <p className="text-gray-400">No ads added yet.</p>
          )}
          {ads.map((ad, index) => (
            <div
              key={index}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 mb-4 hover:border-orange-500/50 transition-colors"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium text-orange-500">
                  Ad #{index + 1}
                </h3>
                <button
                  type="button"
                  onClick={() => removeAd(index)}
                  className="text-orange-500 hover:text-orange-700 font-medium"
                >
                  Remove
                </button>
              </div>
              <label className="block mb-3">
                <span className="block text-sm font-medium text-orange-500 mb-1">
                  Image URL
                </span>
                <input
                  type="text"
                  value={ad.img}
                  onChange={(e) => handleAdChange(index, 'img', e.target.value)}
                  placeholder="/ads/ad1.jpg"
                  className="w-full bg-gray-700 text-gray-200 rounded-lg border border-gray-600 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50 placeholder-gray-500"
                />
              </label>
              <label className="block mb-3">
                <span className="block text-sm font-medium text-orange-500 mb-1">
                  Ad URL
                </span>
                <input
                  type="text"
                  value={ad.url}
                  onChange={(e) => handleAdChange(index, 'url', e.target.value)}
                  placeholder="https://example.com/ad1?trace=ad1"
                  className="w-full bg-gray-700 text-gray-200 rounded-lg border border-gray-600 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50 placeholder-gray-500"
                />
              </label>
              <label className="block">
                <span className="block text-sm font-medium text-orange-500 mb-1">
                  Title
                </span>
                <input
                  type="text"
                  value={ad.title}
                  onChange={(e) =>
                    handleAdChange(index, 'title', e.target.value)
                  }
                  placeholder="Ad Title"
                  className="w-full bg-gray-700 text-gray-200 rounded-lg border border-gray-600 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50 placeholder-gray-500"
                />
              </label>
            </div>
          ))}
        </div>

        {/* Banners Section */}
        <div className="w-full bg-gray-900 shadow-lg rounded-xl p-6 border border-orange-500/30">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-orange-500">Banners</h2>
            <button
              type="button"
              onClick={addBanner}
              className="bg-orange-600 text-black px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors"
            >
              Add Banner
            </button>
          </div>
          {banners.length === 0 && (
            <p className="text-gray-400">No banners added yet.</p>
          )}
          {banners.map((banner, index) => (
            <div
              key={index}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 mb-4 hover:border-orange-500/50 transition-colors"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium text-orange-500">
                  Banner #{index + 1}
                </h3>
                <button
                  type="button"
                  onClick={() => removeBanner(index)}
                  className="text-orange-500 hover:text-orange-700 font-medium"
                >
                  Remove
                </button>
              </div>
              <label className="block mb-3">
                <span className="block text-sm font-medium text-orange-500 mb-1">
                  Image URL
                </span>
                <input
                  type="text"
                  value={banner.src}
                  onChange={(e) =>
                    handleBannerChange(index, 'src', e.target.value)
                  }
                  placeholder="https://..."
                  className="w-full bg-gray-700 text-gray-200 rounded-lg border border-gray-600 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50 placeholder-gray-500"
                />
              </label>
              <label className="block mb-3">
                <span className="block text-sm font-medium text-orange-500 mb-1">
                  Light Image URL
                </span>
                <input
                  type="text"
                  value={banner.srcLight}
                  onChange={(e) =>
                    handleBannerChange(index, 'srcLight', e.target.value)
                  }
                  placeholder="https://..."
                  className="w-full bg-gray-700 text-gray-200 rounded-lg border border-gray-600 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50 placeholder-gray-500"
                />
              </label>
              <label className="block mb-3">
                <span className="block text-sm font-medium text-orange-500 mb-1">
                  Link
                </span>
                <input
                  type="text"
                  value={banner.link}
                  onChange={(e) =>
                    handleBannerChange(index, 'link', e.target.value)
                  }
                  placeholder="https://..."
                  className="w-full bg-gray-700 text-gray-200 rounded-lg border border-gray-600 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50 placeholder-gray-500"
                />
              </label>
              <label className="block mb-3">
                <span className="block text-sm font-medium text-orange-500 mb-1">
                  Title
                </span>
                <input
                  type="text"
                  value={banner.title}
                  onChange={(e) =>
                    handleBannerChange(index, 'title', e.target.value)
                  }
                  placeholder="Banner Title"
                  className="w-full bg-gray-700 text-gray-200 rounded-lg border border-gray-600 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50 placeholder-gray-500"
                />
              </label>
              <label className="block mb-3">
                <span className="block text-sm font-medium text-orange-500 mb-1">
                  Description
                </span>
                <textarea
                  value={banner.description}
                  onChange={(e) =>
                    handleBannerChange(index, 'description', e.target.value)
                  }
                  placeholder="Banner description"
                  className="w-full bg-gray-700 text-gray-200 rounded-lg border border-gray-600 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50 placeholder-gray-500"
                ></textarea>
              </label>
              <label className="block mb-3">
                <span className="block text-sm font-medium text-orange-500 mb-1">
                  Tag
                </span>
                <input
                  type="text"
                  value={banner.tag}
                  onChange={(e) =>
                    handleBannerChange(index, 'tag', e.target.value)
                  }
                  placeholder="Tag"
                  className="w-full bg-gray-700 text-gray-200 rounded-lg border border-gray-600 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50 placeholder-gray-500"
                />
              </label>
              <label className="block">
                <span className="block text-sm font-medium text-orange-500 mb-1">
                  Button Name
                </span>
                <input
                  type="text"
                  value={banner.buttonName}
                  onChange={(e) =>
                    handleBannerChange(index, 'buttonName', e.target.value)
                  }
                  placeholder="Button text"
                  className="w-full bg-gray-700 text-gray-200 rounded-lg border border-gray-600 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50 placeholder-gray-500"
                />
              </label>
            </div>
          ))}
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
