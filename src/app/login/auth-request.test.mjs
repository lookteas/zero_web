import test from 'node:test'
import assert from 'node:assert/strict'

import { requestAuth } from './auth-request.mjs'

const apiBaseUrl = 'http://localhost:8888/api/v1'

test('requestAuth returns null when fetch rejects', async () => {
  const result = await requestAuth(apiBaseUrl, '/auth/login', { account: 'demo_user', password: '123456' }, async () => {
    throw new TypeError('fetch failed')
  })

  assert.equal(result, null)
})

test('requestAuth returns null when response is not ok', async () => {
  const result = await requestAuth(apiBaseUrl, '/auth/login', { account: 'demo_user', password: '123456' }, async () => ({
    ok: false,
    json: async () => ({ code: 1 }),
  }))

  assert.equal(result, null)
})

test('requestAuth returns parsed json when response is ok', async () => {
  const payload = { data: { user: { id: 1, account: 'demo_user' } } }
  const result = await requestAuth(apiBaseUrl, '/auth/login', { account: 'demo_user', password: '123456' }, async () => ({
    ok: true,
    json: async () => payload,
  }))

  assert.deepEqual(result, payload)
})
