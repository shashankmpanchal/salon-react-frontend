const styles = {
  confirmed: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-salon-100 text-salon-600',
  pending: 'bg-amber-100 text-amber-800',
  available: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  occupied: 'bg-red-50 text-red-700 border border-red-200',
  active: 'bg-emerald-100 text-emerald-800',
  deactive: 'bg-red-100 text-red-800',
};

export default function Badge({ children, variant = 'confirmed' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${styles[variant] || styles.confirmed}`}
    >
      {children}
    </span>
  )
}
