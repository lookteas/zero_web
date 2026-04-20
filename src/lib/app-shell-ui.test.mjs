import test from 'node:test'
import assert from 'node:assert/strict'

import { getBottomTabItemClassName, getDesktopAccountAreaClassName } from './app-shell-ui.mjs'

test('getDesktopAccountAreaClassName keeps account block desktop only', () => {
  const className = getDesktopAccountAreaClassName()

  assert.match(className, /hidden/)
  assert.match(className, /md:flex/)
  assert.doesNotMatch(className, /^flex/)
})

test('getBottomTabItemClassName gives active tabs a soft raised button treatment', () => {
  const className = getBottomTabItemClassName(true)

  assert.match(className, /linear-gradient/)
  assert.match(className, /border-\[color:rgba\(19,111,99,0\.16\)\]/)
  assert.match(className, /shadow-\[/)
  assert.match(className, /text-\[var\(--primary\)\]/)
})

test('getBottomTabItemClassName keeps inactive tabs understated', () => {
  const className = getBottomTabItemClassName(false)

  assert.match(className, /border-transparent/)
  assert.match(className, /bg-transparent/)
  assert.match(className, /text-\[var\(--foreground-soft\)\]/)
})