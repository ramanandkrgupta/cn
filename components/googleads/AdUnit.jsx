// components/AdUnit.js
'use client'
import { useEffect } from 'react'

const AdUnit = ({
  adSlot,
  adFormat = 'auto',
  layout = '',
  fullWidth = false,
}) => {
  useEffect(() => {
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {
      console.error('AdSense error:', e)
    }
  }, [])

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block', textAlign: 'center' }}
      data-ad-client="ca-pub-7004515632237084"
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-ad-layout={layout}
      data-full-width-responsive={fullWidth ? 'true' : 'false'}
    />
  )
}

export default AdUnit
