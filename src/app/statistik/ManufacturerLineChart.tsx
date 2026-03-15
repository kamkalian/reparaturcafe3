'use client'

import { useState, useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts'
import { type ManufacturerTrend } from '@/server/statistics'

const COLORS = [
  '#2563eb', '#dc2626', '#16a34a', '#d97706', '#7c3aed',
  '#db2777', '#0891b2', '#65a30d', '#ea580c', '#6366f1',
]

const MONTH_SHORT = [
  'Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun',
  'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez',
]

interface Props {
  data: ManufacturerTrend[]
}

type ViewMode = 'month' | 'year'

export default function ManufacturerLineChart({ data }: Props) {
  const [hidden, setHidden] = useState<Set<string>>(new Set())
  const [viewMode, setViewMode] = useState<ViewMode>('month')

  // Determine full date range from data
  const { minYear, minMonth, maxYear, maxMonth } = useMemo(() => {
    let minY = Infinity, minM = Infinity, maxY = -Infinity, maxM = -Infinity
    data.forEach(trend =>
      trend.data.forEach(pt => {
        if (pt.year < minY || (pt.year === minY && pt.month < minM)) { minY = pt.year; minM = pt.month }
        if (pt.year > maxY || (pt.year === maxY && pt.month > maxM)) { maxY = pt.year; maxM = pt.month }
      })
    )
    if (!isFinite(minY)) { const now = new Date(); return { minYear: now.getFullYear(), minMonth: 1, maxYear: now.getFullYear(), maxMonth: now.getMonth() + 1 } }
    return { minYear: minY, minMonth: minM, maxYear: maxY, maxMonth: maxM }
  }, [data])

  // Monthly view: every month in range, 0 if no data
  const monthlyData = useMemo(() => {
    const rows: Record<string, string | number>[] = []
    let y = minYear, m = minMonth
    while (y < maxYear || (y === maxYear && m <= maxMonth)) {
      const label = `${MONTH_SHORT[m - 1]} ${y}`
      const entry: Record<string, string | number> = { label }
      data.forEach(trend => {
        const pt = trend.data.find(p => p.year === y && p.month === m)
        entry[trend.manufacturer] = pt ? pt.count : 0
      })
      rows.push(entry)
      m++
      if (m > 12) { m = 1; y++ }
    }
    return rows
  }, [data, minYear, minMonth, maxYear, maxMonth])

  // Yearly view: sum per year
  const yearlyData = useMemo(() => {
    const yearSet = new Set<number>()
    for (let y = minYear; y <= maxYear; y++) yearSet.add(y)
    return Array.from(yearSet).sort().map(y => {
      const entry: Record<string, string | number> = { label: String(y) }
      data.forEach(trend => {
        const total = trend.data
          .filter(pt => pt.year === y)
          .reduce((sum, pt) => sum + pt.count, 0)
        entry[trend.manufacturer] = total
      })
      return entry
    })
  }, [data, minYear, maxYear])

  function toggleLine(manufacturer: string) {
    setHidden(prev => {
      const next = new Set(prev)
      if (next.has(manufacturer)) next.delete(manufacturer)
      else next.add(manufacturer)
      return next
    })
  }

  if (data.length === 0) {
    return <p className="text-gray-400 text-sm">Noch keine Trend-Daten vorhanden.</p>
  }

  const chartData = viewMode === 'month' ? monthlyData : yearlyData

  return (
    <div>
      {/* Toggle */}
      <div className="flex gap-1 mb-3 w-fit rounded-lg border border-gray-200 bg-gray-50 p-0.5">
        {(['month', 'year'] as ViewMode[]).map(mode => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
              viewMode === mode
                ? 'bg-white shadow text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {mode === 'month' ? 'Monat' : 'Jahr'}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: viewMode === 'month' ? 60 : 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11 }}
            interval={viewMode === 'month' ? 0 : 0}
            angle={viewMode === 'month' ? -45 : 0}
            textAnchor={viewMode === 'month' ? 'end' : 'middle'}
            height={viewMode === 'month' ? 60 : 30}
          />
          <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={30} />
          <Tooltip />
          <Legend
            onClick={(e) => toggleLine(e.value as string)}
            wrapperStyle={{ cursor: 'pointer', fontSize: 12 }}
            formatter={(value) => (
              <span style={{ color: hidden.has(value as string) ? '#bbb' : undefined }}>
                {value}
              </span>
            )}
          />
          {data.map((trend, i) => (
            <Bar
              key={trend.manufacturer}
              dataKey={trend.manufacturer}
              stackId="a"
              fill={COLORS[i % COLORS.length]}
              hide={hidden.has(trend.manufacturer)}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
