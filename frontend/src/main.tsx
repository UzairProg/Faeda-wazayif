import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { AppProviders } from './providers/AppProviders'
import './index.css'

const rootElement = document.getElementById('root')
if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <AppProviders>
        <App />
      </AppProviders>
    </React.StrictMode>,
  )
} else {
  // Fallback for hybrid flask mount if needed during transition, 
  // but strictly we are building an independent SPA now.
  const phoneRoot = document.getElementById('react-phone-input-root')
  if (phoneRoot) {
    createRoot(phoneRoot).render(
      <React.StrictMode>
        <AppProviders>
          <div className="p-4 text-red-500 font-bold">
            Please mount the full App on a #root div for the independent frontend.
          </div>
        </AppProviders>
      </React.StrictMode>,
    )
  }
}
