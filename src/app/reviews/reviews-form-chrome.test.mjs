import test from 'node:test'
import assert from 'node:assert/strict'

import { getReviewsFieldChrome } from './reviews-form-chrome.mjs'

test('getReviewsFieldChrome returns restrained premium accents for review writing fields', () => {
  const actual = getReviewsFieldChrome('actualSituation')
  const suggestion = getReviewsFieldChrome('suggestion')

  assert.equal(actual.label, '过程回顾')
  assert.equal(suggestion.label, '下一步调整')
  assert.match(actual.dotClassName, /rounded-full/)
  assert.match(suggestion.panelClassName, /linear-gradient/)
  assert.notEqual(actual.pillClassName, suggestion.pillClassName)
})