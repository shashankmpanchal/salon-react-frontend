import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { seatsApi } from '../../api/seatsApi'
import Input from '../../components/ui/Input'
import Toggle from '../../components/ui/Toggle'
import Button from '../../components/ui/Button'
import Alert from '../../components/ui/Alert'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const defaultValues = {
  seatName: '',
  status: 'active',
}

function mapSeatToFormValues(seat) {
  return {
    seatName: seat?.seatName || '',
    status: seat?.status === 'deactive' ? 'deactive' : 'active',
  }
}

export default function SeatsForm({
  open,
  seatId,
  seatData,
  loadingSeat,
  fetchError,
  onClose,
  onSuccess,
}) {
  const isEdit = Boolean(seatId)
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
    values: isEdit && seatData ? mapSeatToFormValues(seatData) : undefined,
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
        const trimmedName = data.seatName?.trim()
        if (trimmedName) payload.seatName = trimmedName
        if (data.status) payload.status = data.status
        await seatsApi.update(seatId, payload)
        setSuccessMessage('Seat updated successfully.')
      } else {
        await seatsApi.create({
          seatName: data.seatName.trim(),
          status: data.status,
        })
        setSuccessMessage('Seat created successfully.')
      }
      reset(defaultValues)
      onSuccess?.()
      onClose?.()
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message ||
          err.message ||
          `Failed to ${isEdit ? 'update' : 'create'} seat`,
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (!open) return null

  const showFormLoader = isEdit && loadingSeat
  const showForm = !isEdit || (seatData && !loadingSeat)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-salon-950/60 px-4 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="seat-form-title"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2 id="seat-form-title" className="font-display text-xl font-bold text-salon-900">
            {isEdit ? 'Edit seat' : 'Create seat'}
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
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
              placeholder="Enter seat name"
              error={errors.seatName?.message}
              {...register('seatName', {
                required: 'Name is required',
                validate: (value) =>
                  value.trim() !== '' || 'Name cannot be empty or only spaces',
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
  )
}
