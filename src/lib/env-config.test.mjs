import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const envSource = readFileSync(new URL('./env.ts', import.meta.url), 'utf8')
const envDevelopment = readFileSync(new URL('../../.env.development', import.meta.url), 'utf8')
const envProduction = readFileSync(new URL('../../.env.production', import.meta.url), 'utf8')
const envExample = readFileSync(new URL('../../.env.example', import.meta.url), 'utf8')

test('env loader reads required api base url from environment files', () => {
  assert.equal(envSource.includes("process.env[name]"), true)
  assert.equal(envSource.includes('http://localhost:8888/api/v1'), false)
  assert.equal(envSource.includes('.env.development'), true)
  assert.equal(envSource.includes('.env.production'), true)
  assert.equal(envDevelopment.includes('NEXT_PUBLIC_API_BASE_URL='), true)
  assert.equal(envProduction.includes('NEXT_PUBLIC_API_BASE_URL='), true)
  assert.equal(envExample.includes('NEXT_PUBLIC_API_BASE_URL='), true)
})