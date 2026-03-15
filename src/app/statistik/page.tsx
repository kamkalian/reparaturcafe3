import { fetchStatistics } from '@/server/statistics'
import StatistikClient from './StatistikClient'

export default async function StatistikPage() {
  const stats = await fetchStatistics()

  if (!stats) {
    return (
      <div className="text-center py-20 text-gray-500">
        Statistiken konnten nicht geladen werden.
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <h2 className="text-4xl font-extrabold">Statistiken</h2>
      <StatistikClient initialStats={stats} />
    </div>
  )
}
