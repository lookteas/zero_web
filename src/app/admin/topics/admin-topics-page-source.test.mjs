import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const source = readFileSync(new URL('./page.tsx', import.meta.url), 'utf8')

test('admin topics page requests schedule topics with computed weekStart', () => {
  assert.match(source, /const query = await searchParams\s*;/)
  assert.match(source, /const timelineStart = parseTimelineStart\(query\.weekStart, new Date\(\)\)\s*;/)
  assert.match(source, /const scheduleTopics = await listAdminTopics\(\{ weekStart: timelineStart \}\)\s*;/)
  assert.ok(
    source.indexOf('const timelineStart = parseTimelineStart(query.weekStart, new Date())') <
      source.indexOf('const scheduleTopics = await listAdminTopics({ weekStart: timelineStart })'),
  )
})

test('admin topics page keeps legacy topic forms backed by legacy topic rows', () => {
  assert.match(source, /const legacyTopics = await listAdminTopics\(\)\s*;/)
  assert.match(source, /buildTopicTimeline\(scheduleTopics, timelineStart\)/)
  assert.match(source, /legacyTopics\.map\(\(item\) =>/)
  assert.doesNotMatch(source, /scheduleTopics\.map\(\(item\) =>[\s\S]*updateTopicAction/)
})

test('admin topics page renders awareness cycle settings from admin cycle info', () => {
  assert.match(source, /import \{[^}]*getAdminAwarenessCycle[^}]*\} from "@\/lib\/api"/s)
  assert.match(source, /import \{[^}]*updateAwarenessCycleAction[^}]*\} from "\.\/actions"/s)
  assert.match(source, /cycleUpdated\?: string/)
  assert.match(source, /const cycleInfo = await getAdminAwarenessCycle\(\)/)
  assert.match(source, /query\.cycleUpdated[\s\S]*活动设置已保存/)
  assert.match(source, /eligibleAwarenessCount/)
  assert.match(source, /cycleInfo\.startDate/)
  assert.match(source, /cycleInfo\.restDays/)
  assert.match(source, /action=\{updateAwarenessCycleAction\}/)
  assert.match(source, /name="startDate"[\s\S]*type="date"[\s\S]*defaultValue=\{cycleInfo\.startDate\}/)
  assert.match(source, /name="restDays"[\s\S]*type="number"[\s\S]*defaultValue=\{cycleInfo\.restDays\}/)
  assert.match(source, /name="returnWeekStart"[\s\S]*value=\{timelineStart\}/)
})

test('admin topics page shows this week awareness topics from cycle info', () => {
  assert.match(source, /本周主题|本周意识点/)
  assert.match(source, /cycleInfo\.weekDays\.map/)
  assert.match(source, /day\.isRestDay/)
  assert.match(source, /day\.title/)
  assert.match(source, /day\.summary/)
})
