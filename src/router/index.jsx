import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { routes } from './routers'

const router = createBrowserRouter(routes)

export default function AppRouter() {
  return <RouterProvider router={router} />
}
