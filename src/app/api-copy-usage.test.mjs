import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const pageFiles = [
  './page.tsx',
  './discussion/page.tsx',
  './logs/page.tsx',
  './reviews/page.tsx',
  './reviews/history/page.tsx',
  './today/page.tsx',
  './today/history/page.tsx',
  './vote/page.tsx',
]

const forbiddenApiCopyLiterals = [
  '暂时连不上后端接口。',
  '接口暂时不可用',
  '请先启动 API 服务，再回来刷新。',
  '请先确认后端 API 已启动。',
  '请先确认后端 API 服务已启动，再回来刷新。',
  '当前未能读取到投票数据，请检查',
  '\\u63a5\\u53e3\\u6682\\u65f6\\u4e0d\\u53ef\\u7528',
  '\\u8bf7\\u5148\\u542f\\u52a8 API \\u670d\\u52a1\\uff0c\\u518d\\u56de\\u6765\\u5237\\u65b0\\u3002',
]

test('page files do not inline shared api status copy', () => {
  const offenders = pageFiles.flatMap((relativePath) => {
    const source = readFileSync(new URL(relativePath, import.meta.url), 'utf8')

    return forbiddenApiCopyLiterals
      .filter((literal) => source.includes(literal))
      .map((literal) => `${relativePath}: ${literal}`)
  })

  assert.deepEqual(offenders, [])
})