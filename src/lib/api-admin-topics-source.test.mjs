import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const source = readFileSync(new URL('./api.ts', import.meta.url), 'utf8')

test('listAdminTopics accepts weekStart and sends it as an admin topics query param', () => {
  assert.match(source, /listAdminTopics\(filters\?: \{[^}]*weekStart\?: string[^}]*\}/s)
  assert.match(source, /if \(filters\?\.weekStart\) params\.set\("weekStart", filters\.weekStart\)/)
})
