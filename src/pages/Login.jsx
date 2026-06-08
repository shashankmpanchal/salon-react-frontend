import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { clearAuthError, login } from '../store/slices/authSlice'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'
import { ROUTES } from '../utils/constants'

const EMAIL_PATTERN = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user, token } = useSelector((s) => s.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: '', password: '' },
    mode: 'onBlur',
  });

  useEffect(() => {
    if (token && user) {
      navigate(user.role === 'admin' ? ROUTES.ADMIN : ROUTES.DASHBOARD, {
        replace: true,
      });
    }
  }, [token, user, navigate]);

  useEffect(() => () => dispatch(clearAuthError()), [dispatch]);

  const onSubmit = ({ email, password }) => {
    dispatch(login({ email, password })).then((result) => {
      if (login.fulfilled.match(result)) {
        const role = result.payload.user.role;
        navigate(role === 'admin' ? ROUTES.ADMIN : ROUTES.DASHBOARD);
      }
    });
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 bg-gradient-to-br from-salon-800 via-salon-700 to-salon-900 lg:flex lg:flex-col lg:justify-center lg:px-16">
        <h1 className="font-display text-4xl font-bold text-white">LuxeCuts</h1>
        <p className="mt-4 max-w-md text-lg text-salon-200">
          Book your perfect salon experience. Choose your stylist, pick a time,
          and relax.
        </p>
      </div>

      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <h2 className="font-display text-3xl font-bold text-salon-900">
            Welcome back
          </h2>
          <p className="mt-2 text-salon-600">
            Sign in to manage your appointments
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 space-y-5"
            noValidate
          >
            {error && (
              <Alert
                type="error"
                message={error}
                onClose={() => dispatch(clearAuthError())}
              />
            )}

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: EMAIL_PATTERN,
                  message: 'Enter a valid email address',
                },
              })}
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="current-password"
              error={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />
            <label className="flex items-center gap-2 text-sm text-salon-600">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                className="h-4 w-4 rounded border-salon-300 text-salon-700 focus:ring-salon-500"
              />
              Show password
            </label>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-salon-600">
            Don&apos;t have an account?{' '}
            <Link
              to={ROUTES.REGISTER}
              className="font-medium text-salon-700 hover:text-salon-900"
            >
              Register
            </Link>
          </p>

          {/* <div className="mt-8 rounded-lg bg-salon-50 p-4 text-xs text-salon-600">
            <p className="font-medium text-salon-800">Demo accounts</p>
            <p className="mt-1">Register a customer account, or use the seeded admin:</p>
            <p>Admin: admin@hairsalon.com / Admin@12345</p>
          </div> */}
        </div>
      </div>
    </div>
  );
}
