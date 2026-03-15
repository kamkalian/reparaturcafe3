'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { OpenTimeBucket } from '@/server/statistics'

interface Props {
  data: OpenTimeBucket[]
}

export default function OpenTimeChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="bucket" tick={{ fontSize: 13 }} />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="count" name="Aufgaben" fill="#10b981" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
