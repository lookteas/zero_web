"use client";

import { useRef, useState } from "react";

type Topic = {
  id: number;
  title: string;
  summary: string;
  description?: string;
  orderNo: number;
  status: number;
  awarenessId?: number;
  isRestDay?: boolean;
};

type TimelineSlot = {
  date: string;
  weekdayLabel: string;
  topic: Topic | null;
  rest: boolean;
  missing: boolean;
};

type AwarenessScheduleEditorProps = {
  slots: TimelineSlot[];
  timelineStart: string;
  updateAction: (formData: FormData) => void | Promise<void>;
  excludeAction: (formData: FormData) => void | Promise<void>;
  insertAction: (formData: FormData) => void | Promise<void>;
};

export function AwarenessScheduleEditor({ slots, timelineStart, updateAction, excludeAction, insertAction }: AwarenessScheduleEditorProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimelineSlot | null>(null);
  const selectedTopic = selectedSlot?.topic;
  const canMaintain = Boolean(selectedTopic?.awarenessId && !selectedSlot?.rest && !selectedTopic?.isRestDay);

  function openSlot(slot: TimelineSlot) {
    if (!slot.topic?.awarenessId || slot.rest || slot.topic.isRestDay) {
      return;
    }
    setSelectedSlot(slot);
    dialogRef.current?.showModal();
  }

  function closeDialog() {
    dialogRef.current?.close();
  }

  return (
    <>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {slots.map((slot) => {
          const clickable = Boolean(slot.topic?.awarenessId && !slot.rest && !slot.topic?.isRestDay);
          const cardClass = `rounded-[14px] border p-4 text-left shadow-[0_10px_24px_rgba(8,91,110,0.035)] transition ${
            slot.missing
              ? "border-rose-200 bg-rose-50"
              : slot.rest
                ? "border-sky-200 bg-sky-50"
                : "border-cyan-900/10 bg-white"
          } ${clickable ? "cursor-pointer hover:border-cyan-600 hover:shadow-[0_14px_30px_rgba(8,91,110,0.08)] focus:outline-none focus:ring-2 focus:ring-cyan-700/25" : ""}`;

          return (
            <button key={slot.date} type="button" onClick={() => openSlot(slot)} className={cardClass} aria-label={clickable ? `维护 ${slot.date} ${slot.topic?.title}` : undefined}>
              <p className="text-xs text-slate-500">{slot.weekdayLabel}</p>
              <p className="mt-1 text-base font-semibold text-slate-900">{slot.date}</p>
              {slot.topic ? (
                <>
                  <p className="mt-3 font-medium text-slate-900">{slot.topic.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{slot.topic.summary}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-[8px] bg-slate-100 px-3 py-1 text-slate-700">排序 {slot.topic.orderNo}</span>
                    {slot.rest ? (
                      <span className="rounded-[8px] bg-sky-100 px-3 py-1 text-sky-700">休息整合中</span>
                    ) : (
                      <span className={`rounded-[8px] px-3 py-1 ${slot.topic.status === 1 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                        {slot.topic.status === 1 ? "启用" : "停用"}
                      </span>
                    )}
                    {clickable ? <span className="rounded-[8px] bg-cyan-50 px-3 py-1 text-cyan-800">点击维护</span> : null}
                  </div>
                </>
              ) : (
                <>
                  <p className="mt-3 font-medium text-rose-700">这一天没有可用意识点</p>
                  <p className="mt-1 text-sm text-rose-600">请检查意识点题库是否已导入，且存在 status=1、is_meta=0 的记录。</p>
                </>
              )}
            </button>
          );
        })}
      </div>

      <dialog ref={dialogRef} onClose={() => setSelectedSlot(null)} className="w-[min(92vw,680px)] rounded-[14px] border border-cyan-900/10 bg-white p-0 text-slate-800 shadow-[0_24px_80px_rgba(15,23,42,0.24)] backdrop:bg-slate-950/35">
        {selectedTopic && canMaintain ? (
          <div className="grid gap-0">
            <div className="border-b border-slate-100 px-5 py-4">
              <p className="text-sm text-slate-500">{selectedSlot?.date} {selectedSlot?.weekdayLabel}</p>
              <p className="mt-1 text-lg font-semibold text-slate-950">维护意识点内容</p>
            </div>

            <form action={updateAction} className="grid gap-4 px-5 py-4 text-sm text-slate-700">
              <input type="hidden" name="awarenessId" value={selectedTopic.awarenessId} />
              <input type="hidden" name="effectiveDate" value={selectedSlot?.date || ""} />
              <input type="hidden" name="returnWeekStart" value={timelineStart} />
              <label className="grid gap-2">
                <span>标题</span>
                <input name="title" defaultValue={selectedTopic.title} className="rounded-[10px] border border-slate-300 px-3 py-2.5" required />
              </label>
              <label className="grid gap-2">
                <span>摘要</span>
                <textarea name="summary" defaultValue={selectedTopic.summary} className="min-h-24 rounded-[10px] border border-slate-300 px-3 py-2.5" />
              </label>
              <label className="grid gap-2">
                <span>详细描述</span>
                <textarea name="description" defaultValue={selectedTopic.description || ""} className="min-h-28 rounded-[10px] border border-slate-300 px-3 py-2.5" />
              </label>
              <div className="flex flex-wrap justify-end gap-2">
                <button type="button" onClick={closeDialog} className="cursor-pointer rounded-[10px] border border-slate-300 px-4 py-2.5 text-slate-700 transition hover:border-slate-500">取消</button>
                <button type="submit" className="cursor-pointer rounded-[10px] bg-cyan-800 px-4 py-2.5 font-medium text-white transition hover:bg-cyan-900">保存修改</button>
              </div>
            </form>

            <form action={insertAction} className="border-t border-slate-100 px-5 py-4 text-sm text-slate-700">
              <input type="hidden" name="effectiveDate" value={selectedSlot?.date || ""} />
              <input type="hidden" name="returnWeekStart" value={timelineStart} />
              <div className="grid gap-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-slate-950">插入意识点到这一天</p>
                  <p className="text-xs text-slate-500">填写已有 ID 时优先生效，否则按标题新建。</p>
                </div>
                <label className="grid gap-2">
                  <span>已有意识点 ID</span>
                  <input name="existingAwarenessId" type="number" min="1" className="rounded-[10px] border border-slate-300 px-3 py-2.5" placeholder="如果题库里已有，填写 ID" />
                </label>
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="grid gap-2">
                    <span>新意识点标题</span>
                    <input name="title" className="rounded-[10px] border border-slate-300 px-3 py-2.5" placeholder="例如：练习平常心" />
                  </label>
                  <label className="grid gap-2">
                    <span>摘要</span>
                    <input name="summary" className="rounded-[10px] border border-slate-300 px-3 py-2.5" placeholder="新建时填写" />
                  </label>
                </div>
                <label className="grid gap-2">
                  <span>详细描述</span>
                  <textarea name="description" className="min-h-20 rounded-[10px] border border-slate-300 px-3 py-2.5" placeholder="新建时填写" />
                </label>
                <div className="flex justify-end">
                  <button type="submit" className="cursor-pointer rounded-[10px] border border-cyan-700 px-4 py-2.5 font-medium text-cyan-800 transition hover:bg-cyan-50">插入并顺延</button>
                </div>
              </div>
            </form>

            <form action={excludeAction} onSubmit={(event) => {
              if (!window.confirm("确认从后续周期剔除这个意识点，并重排之后的日期吗？")) {
                event.preventDefault();
              }
            }} className="border-t border-slate-100 px-5 py-4 text-sm">
              <input type="hidden" name="awarenessId" value={selectedTopic.awarenessId} />
              <input type="hidden" name="effectiveDate" value={selectedSlot?.date || ""} />
              <input type="hidden" name="returnWeekStart" value={timelineStart} />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-slate-600">剔除后会从当前日期起重排后续排期，已打卡记录保留原内容。</p>
                <button type="submit" className="cursor-pointer rounded-[10px] border border-rose-300 px-4 py-2.5 font-medium text-rose-700 transition hover:border-rose-500 hover:bg-rose-50">剔除并重排</button>
              </div>
            </form>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
