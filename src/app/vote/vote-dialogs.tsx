"use client"

import { useMemo, useState } from 'react'

import type { WeeklyVote } from '@/lib/api'

type VoteDialogsProps = {
  vote: WeeklyVote
}

type OpenDialog = 'details' | 'records' | null

function Backdrop({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" onClick={onClose}>
      <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl" onClick={(event) => event.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

export function VoteDialogs({ vote }: VoteDialogsProps) {
  const [openDialog, setOpenDialog] = useState<OpenDialog>(null)
  const candidates = useMemo(() => (Array.isArray(vote.candidates) ? vote.candidates : []), [vote.candidates])
  const myRecords = useMemo(() => (Array.isArray(vote.myRecords) ? vote.myRecords : []), [vote.myRecords])

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={() => setOpenDialog('details')} className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700 transition hover:border-sky-300 hover:text-sky-700">
          投票详情
        </button>
        <button type="button" onClick={() => setOpenDialog('records')} disabled={myRecords.length === 0} className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700 transition disabled:cursor-not-allowed disabled:border-slate-100 disabled:text-slate-400 hover:border-sky-300 hover:text-sky-700">
          我的投票记录
        </button>
      </div>

      {openDialog === 'details' ? (
        <Backdrop onClose={() => setOpenDialog(null)}>
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-slate-900">投票详情</p>
                <p className="mt-1 text-sm text-slate-600">查看本周候选主题与当前票数。</p>
              </div>
              <button type="button" onClick={() => setOpenDialog(null)} className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600">关闭</button>
            </div>

            <div className="space-y-3">
              {candidates.map((item, index) => (
                <div key={item.id} className="rounded-2xl border border-slate-200 p-4 text-sm text-slate-700">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-900">{index + 1}. {item.topicTitle}</p>
                      {item.topicDateLabel ? <p className="mt-1 text-xs text-slate-500">对应日期：{item.topicDateLabel}</p> : null}
                      <p className="mt-1 text-slate-600">{item.topicSummary}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1.5 text-slate-700">{item.voteCount} 票</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Backdrop>
      ) : null}

      {openDialog === 'records' ? (
        <Backdrop onClose={() => setOpenDialog(null)}>
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-slate-900">我的投票记录</p>
                <p className="mt-1 text-sm text-slate-600">查看我最近的投票时间与选择主题。</p>
              </div>
              <button type="button" onClick={() => setOpenDialog(null)} className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600">关闭</button>
            </div>

            <div className="space-y-3">
              {myRecords.map((record) => (
                <div key={record.id} className="rounded-2xl border border-slate-200 p-4 text-sm text-slate-700">
                  <p className="font-medium text-slate-900">{record.topicTitle}</p>
                  <p className="mt-1 text-slate-600">{record.topicSummary}</p>
                  <p className="mt-2 text-xs text-slate-500">投票时间：{record.createdAt}</p>
                </div>
              ))}
            </div>
          </div>
        </Backdrop>
      ) : null}
    </>
  )
}
