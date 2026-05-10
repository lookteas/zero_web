import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const source = readFileSync(new URL('./api.ts', import.meta.url), 'utf8')

test('listAdminTopics accepts weekStart and sends it as an admin topics query param', () => {
  assert.match(source, /listAdminTopics\(filters\?: \{[^}]*weekStart\?: string[^}]*\}/s)
  assert.match(source, /if \(filters\?\.weekStart\) params\.set\("weekStart", filters\.weekStart\)/)
})

test('api exposes admin awareness cycle settings helpers', () => {
  assert.match(source, /export type AwarenessCycleDay = \{/)
  assert.match(source, /export type AwarenessCycleAdminInfo = \{/)
  assert.match(source, /export async function getAdminAwarenessCycle\(\)/)
  assert.match(source, /requestAdmin<AwarenessCycleAdminInfo>\("\/admin\/awareness-cycle"\)/)
  assert.match(source, /export async function updateAdminAwarenessCycle\(payload: \{ startDate: string; restDays\?: number \}\)/)
  assert.match(source, /requestAdmin<\{ code\?: number \}>\("\/admin\/awareness-cycle", \{/)
  assert.match(source, /method: "PATCH"/)
  assert.match(source, /body: JSON\.stringify\(payload\)/)
})
