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

      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="grid gap-2 rounded-xl border border-white bg-white p-3">
          <span className="text-sm font-medium text-slate-800">单日暂停</span>
          <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
            <input
              type="date"
              value={singleDate}
              onChange={(event) => setSingleDate(event.target.value)}
              className="rounded-2xl border border-slate-200 px-4 py-3"
            />
            <button type="button" onClick={addSingleDate} className="rounded-full border border-slate-300 px-4 py-3 text-slate-800 transition hover:border-slate-900">
              添加
            </button>
          </div>
        </div>

        <div className="grid gap-2 rounded-xl border border-white bg-white p-3">
          <span className="text-sm font-medium text-slate-800">区间暂停</span>
          <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
            <input
              type="date"
              value={rangeStart}
              onChange={(event) => setRangeStart(event.target.value)}
              className="rounded-2xl border border-slate-200 px-4 py-3"
            />
            <input
              type="date"
              value={rangeEnd}
              onChange={(event) => setRangeEnd(event.target.value)}
              className="rounded-2xl border border-slate-200 px-4 py-3"
            />
            <button type="button" onClick={addRangeDates} className="rounded-full border border-slate-300 px-4 py-3 text-slate-800 transition hover:border-slate-900">
              添加区间
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-3">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="text-sm font-medium text-slate-800">已选暂停日期</span>
          <span className="text-xs text-slate-500">{dates.length} 天</span>
        </div>
        {dates.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {dates.map((date) => (
              <span key={date} className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm text-amber-800">
                {date}
                <button type="button" onClick={() => removeDate(date)} className="text-xs font-semibold text-amber-700 hover:text-amber-950" aria-label={`移除 ${date}`}>
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
