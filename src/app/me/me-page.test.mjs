import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const source = readFileSync(new URL('./page.tsx', import.meta.url), 'utf8')

test('me page presents a complete personal center surface', () => {
  assert.equal(source.includes('mobileThemeTitle="个人中心"'), true)
  assert.equal(source.includes('hideHero'), true)
  assert.equal(source.includes('Zero Account'), true)
  assert.equal(source.includes('成长工具'), true)
  assert.equal(source.includes('账号安全'), true)
})

test('me page exposes planned feature entries with clear status labels', () => {
  assert.equal(source.includes('意识强度检测'), true)
  assert.equal(source.includes('潜催文档优化'), true)
  assert.equal(source.includes('AI 辅助'), true)
  assert.equal(source.includes('密码修改'), true)
  assert.equal(source.includes('优先规划'), true)
  assert.equal(source.includes('规划中'), true)
  assert.equal(source.includes('即将开放'), true)
  assert.equal(source.includes('待接入'), true)
})
