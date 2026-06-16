export default function Card({ children, className = '', title, subtitle, action }) {
  return (
    <div className={`rounded-2xl border border-salon-200/80 bg-white p-5 shadow-sm sm:p-6 ${className}`}>
      {(title || subtitle || action) && (
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            {title && <h2 className="text-lg font-semibold text-salon-900">{title}</h2>}
            {subtitle && <p className="mt-0.5 text-sm text-salon-500">{subtitle}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </div>
  )
}
