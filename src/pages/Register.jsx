import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { clearAuthError, register as registerUser } from '../store/slices/authSlice'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'
import PhoneInput from '../components/ui/PhoneInput'
import { ROUTES } from '../utils/constants'

const EMAIL_PATTERN = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
const PHONE_PATTERN = /^[6-9][0-9]{9}$/
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/

export default function Register() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, token } = useSelector((s) => s.auth)

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: { name: '', phone: '', email: '', password: '', confirm: '' },
    mode: 'onBlur',
  })

  useEffect(() => {
    if (token) navigate(ROUTES.DASHBOARD, { replace: true })
  }, [token, navigate])

  useEffect(() => () => dispatch(clearAuthError()), [dispatch])

  const onSubmit = ({ name, phone, email, password }) => {
    dispatch(registerUser({ name, phone: `+91 ${phone}`, email, password })).then((result) => {
      if (registerUser.fulfilled.match(result)) navigate(ROUTES.DASHBOARD)
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <Link
          to={ROUTES.LOGIN}
          className="text-sm text-salon-600 hover:text-salon-800"
        >
          ← Back to login
        </Link>
        <h2 className="mt-4 font-display text-3xl font-bold text-salon-900">
          Create account
        </h2>
        <p className="mt-2 text-salon-600">
          Join LuxeCuts to book appointments online
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
            label="Full name"
            autoComplete="name"
            error={errors.name?.message}
            {...register('name', {
              required: 'Full name is required',
              minLength: {
                value: 2,
                message: 'Name must be at least 2 characters',
              },
            })}
          />
          <PhoneInput
            label="Phone number"
            type="tel"
            countryCode="+91"
            inputMode="tel"
            autoComplete="tel"
            placeholder="0000000000"
            error={errors.phone?.message}
            {...register('phone', {
              required: 'Phone number is required',
              pattern: {
                value: PHONE_PATTERN,
                message: 'Enter a valid phone number starting with 6,7,8,9',
              },
            })}
          />
          <Input
            label="Email"
            type="email"
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
            type="password"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              pattern: {
                value: PASSWORD_PATTERN,
                message: 'Password must contain uppercase, lowercase, number, and symbol',
              },
            })}
          />
          <Input
            label="Confirm password"
            type="password"
            autoComplete="new-password"
            error={errors.confirm?.message}
            {...register('confirm', {
              required: 'Please confirm your password',
              validate: (value) =>
                value === getValues('password') || 'Passwords do not match',
            })}
          />

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? 'Creating account…' : 'Register'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-salon-600">
          Already have an account?{' '}
          <Link
            to={ROUTES.LOGIN}
            className="font-medium text-salon-700 hover:text-salon-900"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
