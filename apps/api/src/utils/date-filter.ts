interface DateFilterOptions {
  date?: string // single date: "2026-04-05"
  dateFrom?: string // range start: "2026-04-05"
  dateTo?: string // range end: "2026-04-07"
}

interface DateRangeFilter {
  createdAt?: {
    gte?: Date
    lte?: Date
  }
}

export function buildDateFilter({
  date,
  dateFrom,
  dateTo,
}: DateFilterOptions): DateRangeFilter {
  // Single date
  if (date) {
    return {
      createdAt: {
        gte: new Date(`${date}T00:00:00.000Z`),
        lte: new Date(`${date}T23:59:59.999Z`),
      },
    }
  }

  // Date range
  if (dateFrom || dateTo) {
    return {
      createdAt: {
        ...(dateFrom && { gte: new Date(`${dateFrom}T00:00:00.000Z`) }),
        ...(dateTo && { lte: new Date(`${dateTo}T23:59:59.999Z`) }),
      },
    }
  }

  return {}
}
