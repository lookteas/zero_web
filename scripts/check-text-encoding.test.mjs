import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, writeFile, mkdir } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

import { scanForEncodingIssues } from './check-text-encoding.mjs'

test('scanForEncodingIssues reports replacement characters and mojibake text', async () => {
  const fixtureDir = await mkdtemp(path.join(tmpdir(), 'encoding-guard-'))
  await mkdir(path.join(fixtureDir, 'src'), { recursive: true })

  await writeFile(path.join(fixtureDir, 'src', 'safe.tsx'), 'export const title = "\u4e2a\u4eba\u610f\u8bc6\u5f3a\u5ea6\u6253\u5361\u7ad9"\n', 'utf8')
  await writeFile(path.join(fixtureDir, 'src', 'broken.tsx'), 'export const title = "\ufffd"\nexport const label = "\u00e6\u00b5\u008b\u00e8\u00af\u0095"\n', 'utf8')

  const result = await scanForEncodingIssues({ rootDir: fixtureDir })

  assert.equal(result.ok, false)
  assert.equal(result.issues.length, 2)
  assert.match(result.issues[0].reason, /replacement character/i)
  assert.match(result.issues[1].reason, /mojibake/i)
})

test('scanForEncodingIssues ignores node_modules and binary-like files', async () => {
  const fixtureDir = await mkdtemp(path.join(tmpdir(), 'encoding-guard-'))
  await mkdir(path.join(fixtureDir, 'node_modules', 'pkg'), { recursive: true })
  await mkdir(path.join(fixtureDir, 'assets'), { recursive: true })

  await writeFile(path.join(fixtureDir, 'node_modules', 'pkg', 'bad.ts'), 'const x = "\ufffd"\n', 'utf8')
  await writeFile(path.join(fixtureDir, 'assets', 'image.png'), Buffer.from([0, 1, 2, 3]))

  const result = await scanForEncodingIssues({ rootDir: fixtureDir })

  assert.equal(result.ok, true)
  assert.equal(result.issues.length, 0)
})
