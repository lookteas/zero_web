import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const source = readFileSync(new URL('./app-shell.tsx', import.meta.url), 'utf8')
const configSource = readFileSync(new URL('../../next.config.ts', import.meta.url), 'utf8')

test('app shell uses text-only Zero brand across mobile and desktop', () => {
  assert.equal(source.includes('next/image'), false)
  assert.equal(source.includes('/logo.png?v='), false)
  assert.equal(source.includes('md:hidden">Zero</span>'), true)
  assert.equal(source.includes('text-[22px] font-bold tracking-[0.01em]'), true)
  assert.equal(source.includes('品牌标志'), false)
})

test('next image config keeps cache-busted logo whitelist available', () => {
  assert.equal(configSource.includes('localPatterns'), true)
  assert.equal(configSource.includes('pathname: "/logo.png"'), true)
  assert.equal(configSource.includes('search: "?v=20260420-1"'), true)
})
