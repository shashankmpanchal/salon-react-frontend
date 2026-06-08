import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../store/slices/authSlice'
import { ROUTES } from '../../utils/constants'
import Button from '../ui/Button'

const customerLinks = [
  { to: ROUTES.DASHBOARD, label: 'Dashboard' },
  { to: ROUTES.BOOK, label: 'Book' },
  { to: ROUTES.HISTORY, label: 'History' },
]

const adminLinks = [
  { to: ROUTES.ADMIN, label: 'Dashboard' },
  { to: ROUTES.BOOK, label: 'Book Appointment' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user } = useSelector((s) => s.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const links = user?.role === 'admin' ? adminLinks : customerLinks

  const handleLogout = () => {
    dispatch(logout())
    navigate(ROUTES.LOGIN)
  }

  const navClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      isActive ? 'bg-salon-100 text-salon-800' : 'text-salon-600 hover:bg-salon-50 hover:text-salon-900'
    }`

  return (
    <header className="sticky top-0 z-40 border-b border-salon-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to={user?.role === 'admin' ? ROUTES.ADMIN : ROUTES.DASHBOARD} className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-salon-700 text-sm font-bold text-white">
            L
          </span>
          <span className="font-display text-xl font-bold text-salon-900">LuxeCuts</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={navClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <span className="text-sm text-salon-600">{user?.name}</span>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            Log out
          </Button>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-salon-700 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-salon-100 bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className={navClass} onClick={() => setOpen(false)}>
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-4 border-t border-salon-100 pt-4">
            <p className="mb-2 text-sm text-salon-600">{user?.name}</p>
            <Button variant="secondary" size="sm" className="w-full" onClick={handleLogout}>
              Log out
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
