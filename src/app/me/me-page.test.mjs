import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const source = readFileSync(new URL('./page.tsx', import.meta.url), 'utf8')

test('me page presents a complete personal center surface', () => {
  assert.equal(source.includes('mobileThemeTitle="个人中心"'), true)
  assert.equal(source.includes('hideHero'), true)
  assert.equal(source.includes('Zero 试用账号'), true)
  assert.equal(source.includes('今日练习'), true)
  assert.equal(source.includes('练习进度'), true)
  assert.equal(source.includes('能力中心'), true)
  assert.equal(source.includes('账号安全'), true)
  assert.equal(source.includes('本月打卡热力'), true)
  assert.equal(source.includes('本周重点'), true)
  assert.equal(source.includes('hidden gap-4 md:sticky md:top-6 md:grid'), true)
})

test('me page exposes trial-ready feature entries with clear status labels', () => {
  assert.equal(source.includes('意识强度检测'), true)
  assert.equal(source.includes('潜催文档优化'), true)
  assert.equal(source.includes('AI 辅助'), true)
  assert.equal(source.includes('密码修改'), true)
  assert.equal(source.includes('规划中'), true)
  assert.equal(source.includes('已开放'), true)
  assert.equal(source.includes('即将上线'), true)
  assert.equal(source.includes('待开放'), true)
  assert.equal(source.includes('整理互催记录，生成结构统一、便于复盘的标准文档。'), true)
})

test('me page keeps desktop and mobile personal center affordances in one route', () => {
  assert.equal(source.includes('continue-today-practice'), true)
  assert.equal(source.includes('personal-quick-nav'), true)
  assert.equal(source.includes('grid-cols-[minmax(0,1fr)_356px]'), true)
  assert.equal(source.includes('md:hidden">今日练习'), true)
  assert.equal(source.includes('hidden md:inline">练习进度'), true)
  assert.equal(source.includes('今日进度'), true)
  assert.equal(source.includes('连续打卡'), true)
  assert.equal(source.includes('复盘队列'), true)
  assert.equal(source.includes('累计互催'), true)
})
