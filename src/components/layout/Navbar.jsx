import { useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../store/slices/authSlice'
import { ROUTES } from '../../utils/constants'
import Button from '../ui/Button'

const customerLinks = [
  { to: ROUTES.DASHBOARD, label: 'Dashboard' },
  { to: ROUTES.BOOK, label: 'Book' },
  { to: ROUTES.HISTORY, label: 'History' },
]

const assetsSubmenu = [
  { to: ROUTES.SEATS, label: 'Seats' },
  { to: ROUTES.SERVICES, label: 'Services' },
];

function isAssetsPath(pathname) {
  return assetsSubmenu.some((item) => pathname.startsWith(item.to));
}

function NavDropdown({ label, items, isActive, onNavigate }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          isActive
            ? 'bg-salon-100 text-salon-800'
            : 'text-salon-600 hover:bg-salon-50 hover:text-salon-900'
        }`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {label}
        <svg
          className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 min-w-[10rem] pt-1">
          <div className="rounded-lg border border-salon-200 bg-white py-1 shadow-lg">
            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive: itemActive }) =>
                  `block px-4 py-2 text-sm transition-colors ${
                    itemActive
                      ? 'bg-salon-100 font-medium text-salon-800'
                      : 'text-salon-600 hover:bg-salon-50 hover:text-salon-900'
                  }`
                }
                onClick={() => {
                  setOpen(false);
                  onNavigate?.();
                }}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [mobileAssetsOpen, setMobileAssetsOpen] = useState(false);
  const { user } = useSelector((s) => s.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation();
  const isAdmin = user?.role === 'admin';
  const assetsActive = isAssetsPath(location.pathname);

  const handleLogout = () => {
    dispatch(logout())
    navigate(ROUTES.LOGIN)
  }

  const navClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      isActive ? 'bg-salon-100 text-salon-800' : 'text-salon-600 hover:bg-salon-50 hover:text-salon-900'
    }`

  const closeMobileMenu = () => {
    setOpen(false);
    setMobileAssetsOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-salon-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to={isAdmin ? ROUTES.ADMIN : ROUTES.DASHBOARD}
          className="flex items-center gap-2"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-salon-700 text-sm font-bold text-white">
            L
          </span>
          <span className="font-display text-xl font-bold text-salon-900">
            LuxeCuts
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {isAdmin ? (
            <>
              <NavLink to={ROUTES.ADMIN} className={navClass}>
                Dashboard
              </NavLink>
              <NavDropdown
                label="Assets"
                items={assetsSubmenu}
                isActive={assetsActive}
              />
              <NavLink to={ROUTES.BOOK} className={navClass}>
                Book Appointment
              </NavLink>
            </>
          ) : (
            customerLinks.map((l) => (
              <NavLink key={l.to} to={l.to} className={navClass}>
                {l.label}
              </NavLink>
            ))
          )}
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
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-salon-100 bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {isAdmin ? (
              <>
                <NavLink
                  to={ROUTES.ADMIN}
                  className={navClass}
                  onClick={closeMobileMenu}
                >
                  Dashboard
                </NavLink>
                <button
                  type="button"
                  onClick={() => setMobileAssetsOpen((prev) => !prev)}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    assetsActive
                      ? 'bg-salon-100 text-salon-800'
                      : 'text-salon-600 hover:bg-salon-50 hover:text-salon-900'
                  }`}
                  aria-expanded={mobileAssetsOpen}
                >
                  Assets
                  {/* <svg
                    className={`h-4 w-4 transition-transform ${mobileAssetsOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg> */}
                </button>
                {mobileAssetsOpen && (
                  <div className="ml-3 flex flex-col gap-1 border-l border-salon-200 pl-3">
                    {assetsSubmenu.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        className={navClass}
                        onClick={closeMobileMenu}
                      >
                        {item.label}
                      </NavLink>
                    ))}
                  </div>
                )}
                <NavLink
                  to={ROUTES.BOOK}
                  className={navClass}
                  onClick={closeMobileMenu}
                >
                  Book Appointment
                </NavLink>
              </>
            ) : (
              customerLinks.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className={navClass}
                  onClick={closeMobileMenu}
                >
                  {l.label}
                </NavLink>
              ))
            )}
          </nav>
          <div className="mt-4 border-t border-salon-100 pt-4">
            <p className="mb-2 text-sm text-salon-600">{user?.name}</p>
            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={handleLogout}
            >
              Log out
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
