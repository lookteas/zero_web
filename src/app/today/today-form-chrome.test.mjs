import test from 'node:test'
import assert from 'node:assert/strict'

import { getTodayFieldChrome } from './today-form-chrome.mjs'

test('getTodayFieldChrome returns distinct premium accents for the three today fields', () => {
  const weakness = getTodayFieldChrome('weakness')
  const improvement = getTodayFieldChrome('improvementPlan')
  const verification = getTodayFieldChrome('verificationPath')

  assert.equal(weakness.label, '当前卡点')
  assert.equal(improvement.label, '改进动作')
  assert.equal(verification.label, '验证方式')

  assert.notEqual(weakness.pillClassName, improvement.pillClassName)
  assert.notEqual(improvement.pillClassName, verification.pillClassName)
  assert.match(weakness.dotClassName, /rounded-full/)
})