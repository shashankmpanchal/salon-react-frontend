import { useCallback, useEffect, useMemo, useState } from 'react'
import { seatsApi } from '../../api/seatsApi'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Alert from '../../components/ui/Alert'
import Input from '../../components/ui/Input'
import DataTable from '../../components/ui/DataTable'
import Button from '../../components/ui/Button'
import { formatDateTime } from '../../utils/dates'
import { DeleteIcon, EditIcon } from '../../utils/icons'

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100]

export default function SeatsList({ refreshKey = 0, onCreateClick, onEditClick, onDeleteSuccess }) {
  const [seats, setSeats] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sortBy, setSortBy] = useState('seatId')
  const [sortOrder, setSortOrder] = useState('asc')

  const [seatNameSearch, setSeatNameSearch] = useState('')

  const [debouncedFilters, setDebouncedFilters] = useState({
    seatId: '',
    seatName: '',
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters({
        seatName: seatNameSearch.trim(),
      })
      setPage(1)
      setLoading(true)
    }, 400)
    return () => clearTimeout(timer)
  }, [seatNameSearch])

  useEffect(() => {
    let cancelled = false

    seatsApi
      .getAll({
        page,
        limit: pageSize,
        sortBy,
        sortOrder,
        seatId: debouncedFilters.seatId,
        seatName: debouncedFilters.seatName,
      })
      .then((result) => {
        if (cancelled) return
        setSeats(result.seats)
        setPagination(result.pagination)
        setError(null)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err.response?.data?.message || err.message || 'Failed to load seats')
        setSeats([])
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

  const handleDelete = useCallback(async (seat) => {
    if (!window.confirm(`Delete seat "${seat.seatName}"?`)) return

    try {
      await seatsApi.delete(seat.id)
      onDeleteSuccess?.()
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete seat')
    }
  }, [onDeleteSuccess])

  const columns = useMemo(
    () => [
      { key: 'seatName', label: 'Seat Name', sortable: true },
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
              aria-label={`Edit ${row.seatName}`}
            >
              <EditIcon />
            </button>
            <button
              type="button"
              onClick={() => handleDelete(row)}
              className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
              aria-label={`Delete ${row.seatName}`}
            >
              <DeleteIcon />
            </button>
          </div>
        ),
      },
    ],
    [onEditClick, handleDelete],
  )

  return (
    <Card
      title="All seats"
      action={
        <Button size="sm" onClick={onCreateClick}>
          Create Seat
        </Button>
      }
    >
      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      <DataTable
        columns={columns}
        data={seats}
        loading={loading}
        emptyMessage="No seats found."
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        pagination={pagination}
        pageSize={pageSize}
        onPageChange={(newPage) => {
          setLoading(true);
          setPage(newPage);
        }}
        onPageSizeChange={(size) => {
          setLoading(true);
          setPageSize(size);
          setPage(1);
        }}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        searchOptions={
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Input
              label="Seat Name"
              placeholder="Search by seat name"
              value={seatNameSearch}
              onChange={(e) => setSeatNameSearch(e.target.value)}
            />
          </div>
        }
      />
    </Card>
  );
}
