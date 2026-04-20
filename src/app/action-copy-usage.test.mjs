import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const files = [
  './login/page.tsx',
  './admin/login/page.tsx',
  './today/page.tsx',
  './admin/topics/actions.ts',
  './admin/discussions/actions.ts',
  './vote/actions.ts',
]

const forbiddenLiterals = [
  '登录失败，请重新检查账号和密码。',
  '注册失败，请确认账号可用，且密码不少于 6 位。',
  '管理员登录失败，请检查账号和密码是否正确。',
  '提交前请先把当前卡点、改进行动和验证方式写完整。',
  '主题保存失败，请稍后再试',
  '保存讨论失败',
  '投票暂时失败，请稍后再试',
]

test('auth and action error copy stays centralized', () => {
  const offenders = files.flatMap((relativePath) => {
    const source = readFileSync(new URL(relativePath, import.meta.url), 'utf8')

    return forbiddenLiterals
      .filter((literal) => source.includes(literal))
      .map((literal) => `${relativePath}: ${literal}`)
  })

  assert.deepEqual(offenders, [])
})