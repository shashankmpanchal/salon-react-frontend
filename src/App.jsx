import AuthBootstrap from './components/auth/AuthBootstrap'
import AppRouter from './router'

export default function App() {
  return (
    <AuthBootstrap>
      <AppRouter />
    </AuthBootstrap>
  )
}
