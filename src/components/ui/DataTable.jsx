import Button from './Button'
import LoadingSpinner from './LoadingSpinner'

function SortIcon({ active, direction }) {
  if (!active) {
    return <span className="ml-1 text-salon-300">↕</span>
  }
  return (
    <span className="ml-1 text-salon-700">
      {direction === 'asc' ? '↑' : '↓'}
    </span>
  )
}

export default function DataTable({
  columns,
  data,
  loading,
  emptyMessage = 'No data available.',
  sortBy,
  sortOrder,
  onSort,
  pagination,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  searchOptions = null,
}) {
  if (loading) {
    return <LoadingSpinner className="py-12" />
  }

  if (!data?.length) {
    return <p className="py-12 text-center text-salon-500">{emptyMessage}</p>
  }

  const { page = 1, pages = 1, total = 0 } = pagination || {}

  return (
    <div className="space-y-4">
      {searchOptions && (
        // <div className="flex justify-end">
          searchOptions
        // </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead>
            <tr className="border-b border-salon-200 text-salon-600">
              {columns.map((col) => (
                <th key={col.key} className="pb-3 pr-4 font-medium">
                  {col.sortable ? (
                    <button
                      type="button"
                      onClick={() => onSort(col.key)}
                      className="inline-flex items-center hover:text-salon-900"
                    >
                      {col.label}
                      <SortIcon
                        active={sortBy === col.key}
                        direction={sortOrder}
                      />
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id || row._id} className="border-b border-salon-50">
                {columns.map((col) => (
                  <td key={col.key} className="py-3 pr-4 text-salon-700">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-salon-500">
          Showing page {page} of {pages} ({total} total)
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-salon-600">
            Rows per page
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="rounded-lg border border-salon-200 bg-white px-2 py-1.5 text-sm text-salon-900 focus:border-salon-500 focus:outline-none focus:ring-2 focus:ring-salon-200"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={page >= pages}
              onClick={() => onPageChange(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
