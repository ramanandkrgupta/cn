'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'

export default function Settings() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    darkMode: false,
    language: 'en', // Default language
    fontSize: '2', // Default font size (medium) as string
  })

  // Handle font size change
  const handleFontSizeChange = (e) => {
    const value = e.target.value
    setSettings((prev) => ({ ...prev, fontSize: value }))
    localStorage.setItem('fontSize', value) // Store font size in localStorage
    toast.success('Font size updated')
  }

  // Handle language change
  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value
    setSettings((prev) => ({ ...prev, language: selectedLanguage }))
    toast.success(`Language updated to ${selectedLanguage}`)
  }

  useEffect(() => {
    // Get font size from localStorage if available
    const savedFontSize = localStorage.getItem('fontSize')
    if (savedFontSize) {
      setSettings((prev) => ({ ...prev, fontSize: savedFontSize }))
    } else {
      // Default to '2' (medium) if no font size is found
      localStorage.setItem('fontSize', '2')
    }

    // Apply the font size globally
    updateGlobalFontSize()

    fetchSettings()
  }, [])

  // Fetch settings from API
  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/users/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      toast.error('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  // Handle toggles for email, push notifications, and dark mode
  const handleToggle = async (setting) => {
    try {
      const newValue = !settings[setting]
      const response = await fetch('/api/users/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          [setting]: newValue,
        }),
      })

      if (response.ok) {
        setSettings((prev) => ({
          ...prev,
          [setting]: newValue,
        }))
        toast.success(`${setting} setting updated`)
      } else {
        throw new Error('Failed to update setting')
      }
    } catch (error) {
      console.error('Error updating setting:', error)
      toast.error('Failed to update setting')
    }
  }

  // Update the font size globally based on settings
  useEffect(() => {
    updateGlobalFontSize()
  }, [settings.fontSize])

  const updateGlobalFontSize = () => {
    const fontSizeValue = getFontSizeValue(settings.fontSize)
    document.documentElement.style.setProperty('--font-size', fontSizeValue)
    console.log(`Applying font size: ${fontSizeValue}`) // Debugging log
  }

  const getFontSizeValue = (fontSize) => {
    switch (fontSize) {
      case '0':
        return 'var(--font-size-small)'
      case '1':
        return 'var(--font-size-medium)'
      case '2':
        return 'var(--font-size-large)'
      case '3':
        return 'var(--font-size-xlarge)'
      case '4':
        return 'var(--font-size-xxlarge)'
      default:
        return 'var(--font-size-medium)' // Default case
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex items-center gap-2 mb-6">
        {/* Back Button */}
        <button onClick={() => router.back()} aria-label="Go Back">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>
      <div className="space-y-6">
        {/* Notifications */}
        <div className="bg-base-200 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Notifications</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-gray-500">
                  Receive email updates about your activity
                </p>
              </div>
              <label className="swap swap-flip">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={() => handleToggle('emailNotifications')}
                />
                <div className="swap-on">ON</div>
                <div className="swap-off">OFF</div>
              </label>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-gray-500">
                  Receive push notifications about your activity
                </p>
              </div>
              <label className="swap swap-flip">
                <input
                  type="checkbox"
                  checked={settings.pushNotifications}
                  onChange={() => handleToggle('pushNotifications')}
                />
                <div className="swap-on">ON</div>
                <div className="swap-off">OFF</div>
              </label>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-base-200 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Appearance</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-gray-500">Toggle dark mode theme</p>
              </div>
              <label className="swap swap-flip">
                <input
                  type="checkbox"
                  checked={settings.darkMode}
                  onChange={() => handleToggle('darkMode')}
                />
                <div className="swap-on">ON</div>
                <div className="swap-off">OFF</div>
              </label>
            </div>
          </div>
        </div>

        {/* Language and Font Size */}
        <div className="bg-base-200 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Language</h2>
          <select
            className="select select-bordered w-full"
            value={settings.language}
            onChange={handleLanguageChange}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>

          {/* Font Size Selection - Slider */}
          <h2 className="text-lg font-semibold mt-4 mb-4">Font Size</h2>
          <div className="flex justify-between">
            <span className="text-sm">Small</span>
            <span className="text-sm">Medium</span>
            <span className="text-sm">Big</span>
          </div>
          <input
            type="range"
            min="0"
            max="4"
            step="1"
            value={settings.fontSize || '2'} // Ensure the value is always set
            onChange={handleFontSizeChange}
            className="w-full mt-2"
          />
        </div>
      </div>
    </div>
  )
}
