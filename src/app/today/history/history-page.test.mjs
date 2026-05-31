import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const historyPage = readFileSync(new URL('./page.tsx', import.meta.url), 'utf8')

test('history page exposes sharing for submitted historical tasks', () => {
  assert.equal(historyPage.includes("import { TodaySharePanel } from '../today-share-panel'"), true)
  assert.equal(historyPage.includes('task.status === "submitted" ? <TodaySharePanel task={task} /> : null'), true)
})

test('history page describes the edit window as 72 hours', () => {
  assert.equal(historyPage.includes('三天内，可直接编辑'), true)
  assert.equal(historyPage.includes('48 小时内'), false)
  assert.equal(historyPage.includes('24 小时内'), false)
})
