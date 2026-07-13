import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { PhoneInput } from '@/components/ui/phone-input'
import './index.css'

function PhoneInputWrapper({ initialValue }: { initialValue: string }) {
  const [phone, setPhone] = useState(initialValue)

  return (
    <div className="w-full">
      <PhoneInput
        value={phone}
        onChange={(_value, formatted) => setPhone(formatted)}
        defaultCountry="SA"
        placeholder="رقم الهاتف"
      />
      {/* Hidden input to sync with Flask's form submission */}
      <input type="hidden" name="new_mobile" value={phone} />
    </div>
  )
}

const rootElement = document.getElementById('react-phone-input-root')
if (rootElement) {
  const initialValue = rootElement.getAttribute('data-initial-value') || ''
  createRoot(rootElement).render(
    <React.StrictMode>
      <PhoneInputWrapper initialValue={initialValue} />
    </React.StrictMode>,
  )
}
