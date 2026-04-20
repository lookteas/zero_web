import test from 'node:test'
import assert from 'node:assert/strict'

import { getFeedbackChrome, getEmptyStateCopy } from './feedback-chrome.mjs'

test('getFeedbackChrome returns restrained styles for success alert and secondary button', () => {
  const alert = getFeedbackChrome('successAlert')
  const button = getFeedbackChrome('secondaryButton')

  assert.match(alert.className, /border/)
  assert.match(alert.className, /emerald|primary|success/)
  assert.match(button.className, /shadow/)
  assert.match(button.className, /border/)
})

test('getEmptyStateCopy returns distinct guidance for today logs and reviews', () => {
  const today = getEmptyStateCopy('todayLogs')
  const logs = getEmptyStateCopy('logs')
  const reviews = getEmptyStateCopy('reviews')

  assert.match(today.title, /还没有新的觉察/)
  assert.match(logs.title, /还没有觉察记录/)
  assert.match(reviews.title, /还没到需要复盘的时候/)
})