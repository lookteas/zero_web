import test from 'node:test'
import assert from 'node:assert/strict'

import { isNavItemActive } from './navigation-active.mjs'

test('isNavItemActive matches root and nested routes correctly', () => {
  assert.equal(isNavItemActive('/', '/'), true)
  assert.equal(isNavItemActive('/today', '/'), false)
  assert.equal(isNavItemActive('/today', '/today'), true)
  assert.equal(isNavItemActive('/today/history', '/today'), true)
  assert.equal(isNavItemActive('/logs', '/reviews'), false)
})
