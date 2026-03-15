'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import {
  fetchStatistics,
  type StatisticsResponse,
  type TasksPerMonth,
} from '@/server/statistics'
import OldestOpenTasksTable from './OldestOpenTasksTable'
import ManufacturerSection from './ManufacturerSection'

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

  return {
    fromYear: data[0].year,
    fromMonth: data[0].month,
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
  initialStats: StatisticsResponse
}

export default function StatistikClient({ initialStats }: Props) {
  const [stats, setStats] = useState<StatisticsResponse>(initialStats)
  const [isLoading, setIsLoading] = useState(false)

  const initial = getInitialRange(initialStats.tasks_per_month)
  const [fromYear, setFromYear] = useState(initial.fromYear)
  const [fromMonth, setFromMonth] = useState(initial.fromMonth)
  const [toYear, setToYear] = useState(initial.toYear)
  const [toMonth, setToMonth] = useState(initial.toMonth)

  const yearOptions = getYearOptions(initialStats.tasks_per_month)

  async function applyFilter() {
    setIsLoading(true)
    const result = await fetchStatistics({ fromYear, fromMonth, toYear, toMonth })
    if (result) setStats(result)
    setIsLoading(false)
  }

  return (
    <div className="space-y-10">
      {/* Globaler Datumsfilter */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold mb-3">Zeitraum</h3>
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 font-medium">Von</label>
            <div className="flex gap-2">
              <select
                value={fromYear}
                onChange={e => setFromYear(Number(e.target.value))}
                className="border rounded px-2 py-1.5 text-sm"
              >
                {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <select
                value={fromMonth}
                onChange={e => setFromMonth(Number(e.target.value))}
                className="border rounded px-2 py-1.5 text-sm"
              >
                {MONTH_LABELS.map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 font-medium">Bis</label>
            <div className="flex gap-2">
              <select
                value={toYear}
                onChange={e => setToYear(Number(e.target.value))}
                className="border rounded px-2 py-1.5 text-sm"
              >
                {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <select
                value={toMonth}
                onChange={e => setToMonth(Number(e.target.value))}
                className="border rounded px-2 py-1.5 text-sm"
              >
                {MONTH_LABELS.map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
              </select>
            </div>
          </div>

          <button
            onClick={applyFilter}
            disabled={isLoading}
            className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Lädt…' : 'Anwenden'}
          </button>
        </div>
      </div>

      {/* Aufgaben pro Monat */}
      <section className="bg-white rounded-xl shadow p-6">
        <h3 className="text-2xl font-bold mb-1">Aufgaben pro Monat</h3>
        <p className="text-gray-500 text-sm mb-4">
          Anzahl neu eingegangener Aufgaben je Kalendermonat
        </p>
        <TasksPerMonthChart data={stats.tasks_per_month} />
      </section>

      {/* Älteste offene Aufgaben */}
      <section className="bg-white rounded-xl shadow p-6">
        <h3 className="text-2xl font-bold mb-1">Älteste offene Aufgaben</h3>
        <p className="text-gray-500 text-sm mb-4">
          Aufgaben, die länger als 100 Tage offen sind (max. 10)
        </p>
        <OldestOpenTasksTable tasks={stats.oldest_open_tasks} />
      </section>

      {/* Häufigste Hersteller */}
      <section className="bg-white rounded-xl shadow p-6">
        <h3 className="text-2xl font-bold mb-1">Häufigste Hersteller</h3>
        <ManufacturerSection
          initialData={stats.manufacturers}
          trends={stats.manufacturer_trends}
        />
      </section>
    </div>
  )
}
