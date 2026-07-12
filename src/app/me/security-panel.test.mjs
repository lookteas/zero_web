import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const source = readFileSync(new URL('./security-panel.tsx', import.meta.url), 'utf8')

test('password fields stay in an on-demand security dialog', () => {
  assert.equal(source.includes('useState(passwordError)'), true)
  assert.equal(source.includes('修改密码'), true)
  assert.equal(source.includes('role="dialog"'), true)
  assert.equal(source.includes('name="currentPassword"'), true)
  assert.equal(source.includes('name="newPassword"'), true)
  assert.equal(source.includes('name="confirmPassword"'), true)
  assert.equal(source.includes('changePasswordAction'), true)
  assert.equal(source.includes('更新并重新登录'), true)
})
