import type { DailyLog } from "@/lib/api";

type AwarenessDraft = {
  topicTitle?: string;
  person: string;
  event: string;
  object: string;
  emotion: string;
  change: string;
  note: string;
};

type ParsedAwarenessRecord = AwarenessDraft & {
  summary: string;
};

const fieldOrder: Array<{ key: keyof AwarenessDraft; label: string }> = [
  { key: "topicTitle", label: "主题" },
  { key: "person", label: "人" },
  { key: "event", label: "事" },
  { key: "object", label: "物" },
  { key: "emotion", label: "情绪" },
  { key: "change", label: "变化" },
  { key: "note", label: "补充" },
];

function buildAwarenessSummary(draft: AwarenessDraft) {
  const topicTitle = draft.topicTitle?.trim() || "";
  const person = draft.person.trim();
  const event = draft.event.trim();
  const emotion = draft.emotion.trim();
  const change = draft.change.trim();

  if (change) {
    return change;
  }

  if (emotion && event) {
    return `${emotion} · ${event}`;
  }

  if (event) {
    return event;
  }

  if (emotion) {
    return emotion;
  }

  if (person) {
    return `和「${person}」有关的一次觉察`;
  }

  return `围绕「${topicTitle || "今日主题"}」的一条觉察`;
}

export function serializeAwarenessRecord(draft: AwarenessDraft) {
  const topicTitle = draft.topicTitle?.trim() || "";
  const person = draft.person.trim();
  const event = draft.event.trim();
  const object = draft.object.trim();
  const emotion = draft.emotion.trim();
  const change = draft.change.trim();
  const note = draft.note.trim();

  const summary = buildAwarenessSummary({
    topicTitle,
    person,
    event,
    object,
    emotion,
    change,
    note,
  });

  const remark = fieldOrder
    .map(({ key, label }) => {
      const value = String(
        {
          topicTitle,
          person,
          event,
          object,
          emotion,
          change,
          note,
        }[key] ?? "",
      ).trim();

      return value ? `${label}：${value}` : "";
    })
    .filter(Boolean)
    .join("\n");

  return {
    actionText: summary,
    remark,
    status: "done",
  };
}

export function parseAwarenessRecord(log: Pick<DailyLog, "actionText" | "remark">): ParsedAwarenessRecord {
  const lines = String(log.remark || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const parsed: AwarenessDraft = {
    topicTitle: "",
    person: "",
    event: "",
    object: "",
    emotion: "",
    change: "",
    note: "",
  };

  for (const line of lines) {
    for (const field of fieldOrder) {
      const prefix = `${field.label}：`;
      if (line.startsWith(prefix)) {
        parsed[field.key] = line.slice(prefix.length).trim();
      }
    }
  }

  return {
    ...parsed,
    summary: log.actionText?.trim() || buildAwarenessSummary(parsed),
  };
}
