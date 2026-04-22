import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const layoutSource = readFileSync(new URL('./layout.tsx', import.meta.url), 'utf8')
const globalsSource = readFileSync(new URL('./globals.css', import.meta.url), 'utf8')

test('app layout does not depend on Google font fetching during build', () => {
  assert.equal(layoutSource.includes('next/font/google'), false)
  assert.equal(layoutSource.includes('next/font/local'), true)
  assert.equal(layoutSource.includes('GeistVF.woff2'), true)
  assert.equal(layoutSource.includes('GeistMonoVF.woff2'), true)
  assert.equal(globalsSource.includes('--font-geist-sans:'), true)
  assert.equal(globalsSource.includes('--font-geist-mono:'), true)
})
