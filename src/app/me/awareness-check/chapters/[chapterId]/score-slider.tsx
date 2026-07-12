'use client'

import { useMemo, useState } from 'react'

import type { AwarenessCheckPoint } from '@/lib/api'

function clampScore(value: number) {
  if (value < 0) return 0
  if (value > 100) return 100
  return Math.round(value)
}

function convertedScore(value: number, direction: string) {
  return direction === 'lower' ? 100 - value : value
}

function formatSigned(value: number) {
  if (value === 0) return '0'
  return `${value > 0 ? '+' : ''}${value}`
}

function ScorePill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[16px] border border-[var(--border-soft)] bg-[var(--surface-soft)] px-3 py-3 text-center">
      <span className="block text-[11px] leading-none text-[var(--foreground-faint)]">{label}</span>
      <strong className="mt-2 block text-[15px] leading-none text-[var(--foreground)]">{value}</strong>
    </div>
  )
}

export function ScoreSlider({ point }: { point: AwarenessCheckPoint }) {
  const [selfScore, setSelfScore] = useState(() => clampScore(point.selfScore))
  const score = useMemo(() => clampScore(convertedScore(selfScore, point.direction)), [point.direction, selfScore])
  const refScore = clampScore(point.refScore)
  const delta = score - refScore

  return (
    <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_220px] md:items-end">
      <label className="block">
        <span className="mb-2 flex justify-between gap-3 text-[12px] font-medium text-[var(--foreground-soft)]">
          <span>我的自评</span>
          <span>{selfScore}%</span>
        </span>
        <input
          type="range"
          name={`selfScore-${point.awarenessId}`}
          min="0"
          max="100"
          step="1"
          value={selfScore}
          onChange={(event) => setSelfScore(clampScore(Number(event.target.value)))}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[rgba(219,233,229,0.94)] accent-[var(--primary)]"
        />
      </label>

      <div className="grid grid-cols-3 gap-2">
        <ScorePill label="换算得分" value={String(score)} />
        <ScorePill label="参考" value={String(refScore)} />
        <ScorePill label="差值" value={formatSigned(delta)} />
      </div>
    </div>
  )
}
