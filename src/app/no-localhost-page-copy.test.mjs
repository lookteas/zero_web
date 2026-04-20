import assert from 'node:assert/strict'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

function collectPageFiles(dir) {
  const entries = readdirSync(dir)
  const results = []

  for (const entry of entries) {
    const fullPath = join(dir, entry)
    const stats = statSync(fullPath)

    if (stats.isDirectory()) {
      results.push(...collectPageFiles(fullPath))
      continue
    }

    if (entry === 'page.tsx') {
      results.push(fullPath)
    }
  }

  return results
}

test('page files do not hardcode localhost addresses', () => {
  const rootDir = dirname(fileURLToPath(import.meta.url))
  const pageFiles = collectPageFiles(rootDir)
  const offenders = pageFiles.filter((filePath) => readFileSync(filePath, 'utf8').includes('localhost'))

  assert.deepEqual(offenders, [])
})