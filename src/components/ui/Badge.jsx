const styles = {
  completed: 'bg-green-100 text-green-800',
  confirmed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800',
  pending: 'bg-yellow-100 text-yellow-800',
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
