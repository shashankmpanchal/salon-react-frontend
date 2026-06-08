import { forwardRef } from 'react'

const PhoneInput = forwardRef(function PhoneInput(
  { label, error, id, className = '', countryCode = '+91', ...props },
  ref,
) {
  const inputId = id || props.name

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-salon-800">
          {label}
        </label>
      )}
      <div
        className={`flex overflow-hidden rounded-lg border bg-white transition-colors focus-within:border-salon-500 focus-within:ring-2 focus-within:ring-salon-200 ${
          error ? 'border-red-400' : 'border-salon-200'
        }`}
      >
        <span className="flex items-center border-r border-salon-200 bg-salon-50 px-4 text-sm font-medium text-salon-700">
          {countryCode}
        </span>
        <input
          ref={ref}
          id={inputId}
          className={`min-w-0 flex-1 px-4 py-2.5 text-salon-950 placeholder:text-salon-400 focus:outline-none ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
})

export default PhoneInput
