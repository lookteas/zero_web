"use client";

import { useMemo, useState } from "react";

import { addDateRange, normalizePauseDates } from "./pause-date-utils.mjs";

type PauseDatePickerProps = {
  initialDates: string[];
};

export function PauseDatePicker({ initialDates }: PauseDatePickerProps) {
  const [dates, setDates] = useState(() => normalizePauseDates(initialDates));
  const [singleDate, setSingleDate] = useState("");
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");
  const payload = useMemo(() => dates.join("\n"), [dates]);

  function addSingleDate() {
    setDates((current) => addDateRange(current, singleDate, ""));
    setSingleDate("");
  }

  function addRangeDates() {
    setDates((current) => addDateRange(current, rangeStart, rangeEnd));
    setRangeStart("");
    setRangeEnd("");
  }

  function removeDate(date: string) {
    setDates((current) => current.filter((item) => item !== date));
  }

  return (
    <section className="grid gap-3 md:col-span-3">
      <input type="hidden" name="pausedDates" value={payload} />

      <div className="grid gap-3 rounded-[14px] border border-cyan-900/10 bg-cyan-50/60 p-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="grid gap-2 rounded-[12px] border border-cyan-900/10 bg-white p-3">
          <span className="text-sm font-medium text-slate-800">单日暂停</span>
          <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
            <input
              type="date"
              value={singleDate}
              onChange={(event) => setSingleDate(event.target.value)}
              className="rounded-[10px] border border-slate-300 px-3 py-2.5"
            />
            <button type="button" onClick={addSingleDate} className="cursor-pointer rounded-[10px] border border-slate-300 px-4 py-2.5 text-slate-800 transition hover:border-cyan-700 hover:text-cyan-800">
              添加
            </button>
          </div>
        </div>

        <div className="grid gap-2 rounded-[12px] border border-cyan-900/10 bg-white p-3">
          <span className="text-sm font-medium text-slate-800">区间暂停</span>
          <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
            <input
              type="date"
              value={rangeStart}
              onChange={(event) => setRangeStart(event.target.value)}
              className="rounded-[10px] border border-slate-300 px-3 py-2.5"
            />
            <input
              type="date"
              value={rangeEnd}
              onChange={(event) => setRangeEnd(event.target.value)}
              className="rounded-[10px] border border-slate-300 px-3 py-2.5"
            />
            <button type="button" onClick={addRangeDates} className="cursor-pointer rounded-[10px] border border-slate-300 px-4 py-2.5 text-slate-800 transition hover:border-cyan-700 hover:text-cyan-800">
              添加区间
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-[14px] border border-cyan-900/10 bg-white p-3">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="text-sm font-medium text-slate-800">已选暂停日期</span>
          <span className="text-xs text-slate-500">{dates.length} 天</span>
        </div>
        {dates.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {dates.map((date) => (
              <span key={date} className="inline-flex items-center gap-2 rounded-[10px] border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm text-amber-800">
                {date}
                <button type="button" onClick={() => removeDate(date)} className="cursor-pointer text-xs font-semibold text-amber-700 hover:text-amber-950" aria-label={`移除 ${date}`}>
                  移除
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">暂未设置暂停日期。</p>
        )}
      </div>
    </section>
  );
}
