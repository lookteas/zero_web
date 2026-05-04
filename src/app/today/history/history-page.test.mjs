import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const historyPage = readFileSync(new URL('./page.tsx', import.meta.url), 'utf8')

test('history page exposes sharing for submitted historical tasks', () => {
  assert.equal(historyPage.includes("import { TodaySharePanel } from '../today-share-panel'"), true)
  assert.equal(historyPage.includes('task.status === "submitted" ? <TodaySharePanel task={task} /> : null'), true)
})
