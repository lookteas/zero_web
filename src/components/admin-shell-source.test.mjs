import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const source = readFileSync(new URL('./admin-shell.tsx', import.meta.url), 'utf8')

test('admin shell uses a dense operational layout', () => {
  assert.match(source, /bg-\[#eef7f8\]/)
  assert.match(source, /border-b border-cyan-900\/10/)
  assert.match(source, /max-w-7xl/)
  assert.match(source, /Zero Admin/)
  assert.match(source, /rounded-\[10px\]/)
  assert.doesNotMatch(source, /rounded-3xl/)
})
