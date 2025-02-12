// components/Modal.jsx
'use client'

import { createPortal } from 'react-dom'

export default function Modal({ children }) {
  // Ensure document exists (in client side)
  if (typeof document === 'undefined') return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      {children}
    </div>,
    document.body
  )
}
