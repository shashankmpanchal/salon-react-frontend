import { Navigate } from 'react-router-dom'
import { ROUTES } from '../utils/constants'
import Layout from '../components/layout/Layout'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard'
import BookingCalendar from '../pages/BookingCalendar'
import BookingHistory from '../pages/BookingHistory'
import AdminDashboard from '../pages/AdminDashboard'
// import ProtectedRoute from '../components/auth/ProtectedRoute'
import { HomeRedirect, ProtectedRoute } from './RouteGuards'

export const publicRoutes = [
  {
    path: ROUTES.HOME,
    element: <HomeRedirect />,
  },
  {
    path: ROUTES.LOGIN,
    element: <Login />,
  },
  {
    path: ROUTES.REGISTER,
    element: <Register />,
  },
]

export const protectedRoutes = [
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          { path: ROUTES.DASHBOARD, element: <Dashboard /> },
          { path: ROUTES.BOOK, element: <BookingCalendar /> },
          { path: ROUTES.HISTORY, element: <BookingHistory /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute adminOnly />,
    children: [
      {
        element: <Layout />,
        children: [{ path: ROUTES.ADMIN, element: <AdminDashboard /> }],
      },
    ],
  },
]

export const routes = [
  ...publicRoutes,
  ...protectedRoutes,
  {
    path: '*',
    element: <Navigate to={ROUTES.HOME} replace />,
  },
]
