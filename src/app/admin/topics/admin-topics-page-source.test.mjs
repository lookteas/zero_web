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
