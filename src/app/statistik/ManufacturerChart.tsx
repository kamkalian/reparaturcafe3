'use client'

import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { ManufacturerStat } from '@/server/statistics'

interface Props {
  data: ManufacturerStat[]
  selectedManufacturer?: string | null
  onManufacturerClick?: (manufacturer: string) => void
}

// 36px per bar row, minimum 200px
const ROW_HEIGHT = 36

export default function ManufacturerChart({ data, selectedManufacturer, onManufacturerClick }: Props) {
  const chartHeight = Math.max(200, data.length * ROW_HEIGHT)

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <BarChart
        layout="vertical"
        data={data}
        margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
        style={onManufacturerClick ? { cursor: 'pointer' } : undefined}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" allowDecimals={false} />
        <YAxis type="category" dataKey="manufacturer" tick={{ fontSize: 12 }} width={115} />
        <Tooltip />
        <Bar
          dataKey="count"
          name="Aufgaben"
          radius={[0, 4, 4, 0]}
          onClick={onManufacturerClick ? (entry) => onManufacturerClick((entry as unknown as ManufacturerStat).manufacturer) : undefined}
        >
          {data.map((entry) => (
            <Cell
              key={entry.manufacturer}
              fill={entry.manufacturer === selectedManufacturer ? '#7c3aed' : '#8b5cf6'}
              opacity={selectedManufacturer && entry.manufacturer !== selectedManufacturer ? 0.5 : 1}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
