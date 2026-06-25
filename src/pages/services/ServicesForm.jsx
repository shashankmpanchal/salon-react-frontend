import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { servicesApi } from '../../api/servicesApi'
import Input from '../../components/ui/Input'
import Toggle from '../../components/ui/Toggle'
import Button from '../../components/ui/Button'
import Alert from '../../components/ui/Alert'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const defaultValues = {
  name: '',
  duration: '',
  pricing: '',
  status: 'active',
}

function validateNumberField(value, label) {
  if (value === '' || value == null) return `${label} is required`

  const num = Number(value)
  if (!Number.isFinite(num)) return `${label} must be a number`
  if (!Number.isInteger(num)) return `${label} must be a whole number`
  if (num < 1) return `${label} must be at least 1`
  if (String(Math.abs(num)).length > 5) return `${label} cannot exceed 5 digits`

  return true
}

function mapServiceToFormValues(service) {
  return {
    name: service?.name || '',
    duration: service?.duration ?? '',
    pricing: service?.pricing ?? '',
    status: service?.status === 'deactive' ? 'deactive' : 'active',
  }
}

export default function ServicesForm({
  open,
  serviceId,
  serviceData,
  loadingService,
  fetchError,
  onClose,
  onSuccess,
}) {
  const isEdit = Boolean(serviceId)
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues,
    values: isEdit && serviceData ? mapServiceToFormValues(serviceData) : undefined,
    mode: 'onBlur',
  })

  useEffect(() => {
    if (!open) return

    const previousBodyOverflow = document.body.style.overflow
    const previousHtmlOverflow = document.documentElement.style.overflow

    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousHtmlOverflow
    }
  }, [open])

  const handleClose = () => {
    reset(defaultValues)
    setSuccessMessage(null)
    setErrorMessage(null)
    onClose?.()
  }

  const onSubmit = async (data) => {
    setSuccessMessage(null)
    setErrorMessage(null)
    setSubmitting(true)

    try {
      if (isEdit) {
        const payload = {}
        const trimmedName = data.name?.trim()
        if (trimmedName) payload.name = trimmedName
        if (data.duration !== '') payload.duration = Number(data.duration)
        if (data.pricing !== '') payload.pricing = Number(data.pricing)
        if (data.status) payload.status = data.status
        await servicesApi.update(serviceId, payload)
        setSuccessMessage('Service updated successfully.')
      } else {
        await servicesApi.create({
          name: data.name.trim(),
          duration: Number(data.duration),
          pricing: Number(data.pricing),
          status: data.status,
        })
        setSuccessMessage('Service created successfully.')
      }
      reset(defaultValues)
      onSuccess?.()
      onClose?.()
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message ||
          err.message ||
          `Failed to ${isEdit ? 'update' : 'create'} service`,
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (!open) return null

  const showFormLoader = isEdit && loadingService
  const showForm = !isEdit || (serviceData && !loadingService)

  return (
    <div
      className="fixed mb-0 inset-0 z-50 flex items-center justify-center overflow-hidden bg-salon-950/60 px-4 backdrop-blur-none"
      onClick={handleClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="service-form-title"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2
            id="service-form-title"
            className="font-display text-xl font-bold text-salon-900"
          >
            {isEdit ? 'Edit service' : 'Create service'}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1 text-salon-500 hover:bg-salon-50 hover:text-salon-800"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {showFormLoader ? (
          <LoadingSpinner className="py-12" />
        ) : fetchError && isEdit ? (
          <Alert type="error" message={fetchError} onClose={handleClose} />
        ) : showForm ? (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
            noValidate
          >
            {successMessage && (
              <Alert
                type="success"
                message={successMessage}
                onClose={() => setSuccessMessage(null)}
              />
            )}
            {errorMessage && (
              <Alert
                type="error"
                message={errorMessage}
                onClose={() => setErrorMessage(null)}
              />
            )}

            <Input
              label="Name"
              placeholder="Enter service name"
              error={errors.name?.message}
              {...register('name', {
                required: 'Name is required',
                validate: (value) =>
                  value.trim() !== '' || 'Name cannot be empty or only spaces',
              })}
            />

            <Input
              label="Duration (minutes)"
              type="text"
              inputMode="numeric"
              min={1}
              max={99999}
              maxLength={5}
              placeholder="Enter duration"
              error={errors.duration?.message}
              {...register('duration', {
                validate: (value) => validateNumberField(value, 'Duration'),
              })}
            />

            <Input
              label="Pricing (INR)"
              type="text"
              inputMode="numeric"
              min={1}
              max={99999}
              maxLength={5}
              placeholder="Enter pricing"
              error={errors.pricing?.message}
              {...register('pricing', {
                validate: (value) => validateNumberField(value, 'Pricing'),
              })}
            />

            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Toggle
                  label="Status"
                  checked={field.value === 'active'}
                  activeLabel="Active"
                  inactiveLabel="Deactive"
                  onChange={(isActive) =>
                    field.onChange(isActive ? 'active' : 'deactive')
                  }
                />
              )}
            />

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit'}
              </Button>
            </div>
          </form>
        ) : null}
      </div>
    </div>
  );
}
