'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import {
  fetchManufacturerSimilarPairs,
  bulkRenameManufacturer,
  type ManufacturerStat,
  type ManufacturerSimilarPair,
  type ManufacturerTrend,
} from '@/server/statistics'

const ManufacturerLineChart = dynamic(() => import('./ManufacturerLineChart'), { ssr: false })

interface Props {
  initialData: ManufacturerStat[]
  trends: ManufacturerTrend[]
}

export default function ManufacturerSection({ initialData, trends }: Props) {
  const [pairs, setPairs] = useState<ManufacturerSimilarPair[]>([])
  const [pairsLoading, setPairsLoading] = useState(true)
  const [pendingPair, setPendingPair] = useState<string | null>(null)

  useEffect(() => {
    fetchManufacturerSimilarPairs().then((result) => {
      setPairs(result)
      setPairsLoading(false)
    })
  }, [])

  const handleRename = async (source: string, target: string) => {
    setPendingPair(source)
    try {
      const ok = await bulkRenameManufacturer(source, target)
      if (!ok) return
      const updatedPairs = await fetchManufacturerSimilarPairs()
      setPairs(updatedPairs)
    } finally {
      setPendingPair(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Line chart: top 10 over time */}
      {trends.length === 0 ? (
        <p className="text-gray-400">Noch keine Herstellerdaten vorhanden.</p>
      ) : (
        <div>
          <p className="text-xs text-gray-400 mb-2">
            Top 10 Hersteller – Aufgaben pro Monat (Legende anklicken zum Ein-/Ausblenden)
          </p>
          <ManufacturerLineChart data={trends} />
        </div>
      )}

      {/* Similar pairs */}
      <div>
        <h4 className="font-semibold text-gray-700 mb-1">Ähnliche Hersteller</h4>
        <p className="text-xs text-gray-400 mb-3">
          Mögliche Duplikate mit Ähnlichkeit ≥ 80 %. „Ändern" setzt alle Aufgaben des linken Herstellers auf den rechten um.
        </p>
        {pairsLoading ? (
          <p className="text-gray-400 text-sm">Wird geprüft…</p>
        ) : pairs.length === 0 ? (
          <p className="text-gray-400 text-sm">Keine ähnlichen Herstellernamen gefunden.</p>
        ) : (
          <div className="space-y-2">
            {pairs.map((pair) => (
              <div
                key={`${pair.source}->${pair.target}`}
                className="flex items-center gap-2 flex-wrap bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 text-sm"
              >
                <span className="font-medium text-gray-800">
                  {pair.source}
                  <span className="ml-1 text-gray-400 font-normal text-xs">({pair.source_count})</span>
                </span>

                <span className="text-gray-400">→</span>

                <span className="font-medium text-green-700">
                  {pair.target}
                  <span className="ml-1 text-gray-400 font-normal text-xs">({pair.target_count})</span>
                </span>

                <span className="text-xs text-gray-400">{pair.score} %</span>

                <button
                  disabled={pendingPair !== null}
                  onClick={() => handleRename(pair.source, pair.target)}
                  className="ml-auto px-3 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 disabled:opacity-50 transition-colors whitespace-nowrap"
                >
                  {pendingPair === pair.source ? '…' : 'Ändern'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

