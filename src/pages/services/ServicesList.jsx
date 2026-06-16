import { useCallback, useEffect, useMemo, useState } from 'react'
import { servicesApi } from '../../api/servicesApi'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Alert from '../../components/ui/Alert'
import Input from '../../components/ui/Input'
import DataTable from '../../components/ui/DataTable'
import Button from '../../components/ui/Button'
import { formatDateTime } from '../../utils/dates'
import { DeleteIcon, EditIcon } from '../../utils/icons'

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100]

export default function ServicesList({ refreshKey = 0, onCreateClick, onEditClick, onDeleteSuccess }) {
  const [services, setServices] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sortBy, setSortBy] = useState('serviceId')
  const [sortOrder, setSortOrder] = useState('asc')

  const [serviceNameSearch, setServiceNameSearch] = useState('')

  const [debouncedFilters, setDebouncedFilters] = useState({
    serviceId: '',
    serviceName: '',
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters({
        serviceName: serviceNameSearch.trim(),
      })
      setPage(1)
      setLoading(true)
    }, 400)
    return () => clearTimeout(timer)
  }, [serviceNameSearch])

  useEffect(() => {
    let cancelled = false

    servicesApi
      .getAll({
        page,
        limit: pageSize,
        sortBy,
        sortOrder,
        serviceId: debouncedFilters.serviceId,
        serviceName: debouncedFilters.serviceName,
      })
      .then((result) => {
        if (cancelled) return
        setServices(result.services)
        setPagination(result.pagination)
        setError(null)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err.response?.data?.message || err.message || 'Failed to load services')
        setServices([])
        setPagination(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [page, pageSize, sortBy, sortOrder, debouncedFilters, refreshKey])

  const handleSort = (columnKey) => {
    setLoading(true)
    if (sortBy === columnKey) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(columnKey)
      setSortOrder('asc')
    }
    setPage(1)
  }

  const handleDelete = useCallback(async (service) => {
    if (!window.confirm(`Delete service "${service.name}"?`)) return

    try {
      await servicesApi.delete(service.id)
      onDeleteSuccess?.()
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete service')
    }
  }, [onDeleteSuccess])

  const columns = useMemo(
    () => [
      { key: 'name', label: 'Service Name', sortable: true },
      { key: 'pricing', label: 'Price (INR)', sortable: true },
      { key: 'duration', label: 'Duration (Minutes)', sortable: true },
      {
        key: 'status',
        label: 'Status',
        sortable: true,
        render: (row) => <Badge variant={row.status}>{row.status}</Badge>,
      },
      {
        key: 'createdAt',
        label: 'Created Date',
        sortable: true,
        render: (row) => formatDateTime(row.createdAt),
      },
      {
        key: 'updatedAt',
        label: 'Updated Date',
        sortable: true,
        render: (row) => formatDateTime(row.updatedAt),
      },
      {
        key: 'actions',
        label: 'Actions',
        sortable: false,
        render: (row) => (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onEditClick?.(row.id)}
              className="rounded-lg p-2 text-salon-600 transition-colors hover:bg-salon-100 hover:text-salon-900"
              aria-label={`Edit ${row.name}`}
            >
              <EditIcon />
            </button>
            <button
              type="button"
              onClick={() => handleDelete(row)}
              className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
              aria-label={`Delete ${row.name}`}
            >
              <DeleteIcon />
            </button>
          </div>
        ),
      },
    ],
    [onEditClick, handleDelete],
  );

  return (
    <Card
      title="All services"
      action={
        <Button size="sm" onClick={onCreateClick}>
          Create Service
        </Button>
      }
    >
      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      <DataTable
        columns={columns}
        data={services}
        loading={loading}
        emptyMessage="No services found."
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        pagination={pagination}
        pageSize={pageSize}
        onPageChange={(newPage) => {
          setLoading(true)
          setPage(newPage)
        }}
        onPageSizeChange={(size) => {
          setLoading(true)
          setPageSize(size)
          setPage(1)
        }}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        searchOptions={
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Input
              label="Service Name"
              placeholder="Search by service name"
              value={serviceNameSearch}
              onChange={(e) => setServiceNameSearch(e.target.value)}
            />
          </div>
        }
      />
    </Card>
  )
}
