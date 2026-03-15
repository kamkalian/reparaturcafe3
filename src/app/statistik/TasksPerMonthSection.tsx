'use client'

import { useState, useTransition } from 'react'
import dynamic from 'next/dynamic'
import { fetchTasksPerMonth, type TasksPerMonth } from '@/server/statistics'

const TasksPerMonthChart = dynamic(() => import('./TasksPerMonthChart'), { ssr: false })

const MONTH_LABELS = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
]

function getInitialRange(data: TasksPerMonth[]) {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1

  if (data.length === 0) {
    return { fromYear: currentYear, fromMonth: 1, toYear: currentYear, toMonth: currentMonth }
  }

  const sorted = [...data]
  return {
    fromYear: sorted[0].year,
    fromMonth: sorted[0].month,
    toYear: currentYear,
    toMonth: currentMonth,
  }
}

function getYearOptions(data: TasksPerMonth[]) {
  const now = new Date()
  const currentYear = now.getFullYear()
  const minYear = data.length > 0 ? data[0].year : currentYear
  const years: number[] = []
  for (let y = minYear; y <= currentYear; y++) years.push(y)
  return years
}

interface Props {
  initialData: TasksPerMonth[]
}

export default function TasksPerMonthSection({ initialData }: Props) {
  const initial = getInitialRange(initialData)
  const [data, setData] = useState<TasksPerMonth[]>(initialData)
  const [fromYear, setFromYear] = useState(initial.fromYear)
  const [fromMonth, setFromMonth] = useState(initial.fromMonth)
  const [toYear, setToYear] = useState(initial.toYear)
  const [toMonth, setToMonth] = useState(initial.toMonth)
  const [isPending, startTransition] = useTransition()
  const yearOptions = getYearOptions(initialData)

  function applyFilter() {
    startTransition(async () => {
      const result = await fetchTasksPerMonth({
        fromYear,
        fromMonth,
        toYear,
        toMonth,
      })
      setData(result)
    })
  }

  return (
    <>
      {/* Filter row */}
      <div className="flex flex-wrap items-end gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-semibold">Von</label>
          <div className="flex gap-2">
            <select
              className="border border-gray-300 rounded px-2 py-1 text-sm"
              value={fromMonth}
              onChange={(e) => setFromMonth(Number(e.target.value))}
            >
              {MONTH_LABELS.map((label, i) => (
                <option key={i + 1} value={i + 1}>{label}</option>
              ))}
            </select>
            <select
              className="border border-gray-300 rounded px-2 py-1 text-sm"
              value={fromYear}
              onChange={(e) => setFromYear(Number(e.target.value))}
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-semibold">Bis</label>
          <div className="flex gap-2">
            <select
              className="border border-gray-300 rounded px-2 py-1 text-sm"
              value={toMonth}
              onChange={(e) => setToMonth(Number(e.target.value))}
            >
              {MONTH_LABELS.map((label, i) => (
                <option key={i + 1} value={i + 1}>{label}</option>
              ))}
            </select>
            <select
              className="border border-gray-300 rounded px-2 py-1 text-sm"
              value={toYear}
              onChange={(e) => setToYear(Number(e.target.value))}
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={applyFilter}
          disabled={isPending}
          className="px-4 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Lädt…' : 'Anwenden'}
        </button>
      </div>

      {/* Chart */}
      {data.length > 0 ? (
        <div className={isPending ? 'opacity-50 transition-opacity' : ''}>
          <TasksPerMonthChart data={data} />
        </div>
      ) : (
        <p className="text-gray-400">Keine Daten für den gewählten Zeitraum.</p>
      )}
    </>
  )
}
