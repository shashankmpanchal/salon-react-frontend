export default function Toggle({
  label,
  checked = false,
  onChange,
  activeLabel = 'Active',
  inactiveLabel = 'Inactive',
  error,
  id,
}) {
  const inputId = id || 'toggle'

  return (
    <div className="w-full">
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-salon-800">
          {label}
        </span>
      )}
      <div className="flex items-center gap-3">
        <button
          type="button"
          id={inputId}
          role="switch"
          aria-checked={checked}
          onClick={() => onChange(!checked)}
          className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-salon-200 focus:ring-offset-2 ${
            checked ? 'bg-emerald-600' : 'bg-salon-300'
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
              checked ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
        <span className="text-sm font-medium capitalize text-salon-700">
          {checked ? activeLabel : inactiveLabel}
        </span>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}
