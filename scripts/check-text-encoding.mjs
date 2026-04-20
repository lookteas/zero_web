import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const TEXT_EXTENSIONS = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
  '.json',
  '.md',
  '.mdx',
  '.css',
  '.scss',
  '.less',
  '.html',
  '.yml',
  '.yaml',
  '.txt',
  '.env',
  '.ini',
  '.sql',
  '.go',
])

const IGNORED_DIRS = new Set([
  '.git',
  '.next',
  'node_modules',
  'dist',
  'build',
  'coverage',
  'tmp',
  'temp',
])

const REPLACEMENT_CHAR = String.fromCharCode(65533)
const SUSPICIOUS_MOJIBAKE_RE = new RegExp([
  '\\u00C3.',
  '\\u00C2.',
  '\\u00C5.',
  '\\u00C6.',
  '\\u00C7.',
  '\\u00C9.',
  '\\u00E6.',
  '\\u00E4.',
  '\\u00E5.',
  '\\u00E7.',
  '\\u00E8.',
  '\\u00E9.',
  '\\u00EA.',
  '\\u00EB.',
].join('|'))
const SUSPICIOUS_QUESTION_RUN_RE = /[?]{3,}/

function shouldIgnoreDir(name) {
  return IGNORED_DIRS.has(name)
}

function shouldScanFile(filePath) {
  return TEXT_EXTENSIONS.has(path.extname(filePath).toLowerCase())
}

function detectIssues(text) {
  const issues = []

  if (text.includes(REPLACEMENT_CHAR)) {
    issues.push('contains replacement character')
  }

  if (SUSPICIOUS_MOJIBAKE_RE.test(text)) {
    issues.push('contains suspicious mojibake sequence')
  }

  if (SUSPICIOUS_QUESTION_RUN_RE.test(text)) {
    issues.push('contains suspicious repeated question marks')
  }

  return issues
}

async function walk(dirPath, collector) {
  const entries = await readdir(dirPath, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name)

    if (entry.isDirectory()) {
      if (!shouldIgnoreDir(entry.name)) {
        await walk(fullPath, collector)
      }
      continue
    }

    if (entry.isFile() && shouldScanFile(fullPath)) {
      collector.push(fullPath)
    }
  }
}

export async function scanForEncodingIssues({ rootDir = path.resolve(import.meta.dirname, '../../..') } = {}) {
  const files = []
  await walk(rootDir, files)

  const issues = []

  for (const filePath of files.sort()) {
    let content
    try {
      content = await readFile(filePath, 'utf8')
    } catch (error) {
      issues.push({
        filePath,
        reason: `failed to read as utf-8: ${error instanceof Error ? error.message : String(error)}`,
      })
      continue
    }

    for (const reason of detectIssues(content)) {
      issues.push({ filePath, reason })
    }
  }

  return {
    ok: issues.length === 0,
    issues,
  }
}

async function main() {
  const rootDir = process.argv[2]
    ? path.resolve(process.cwd(), process.argv[2])
    : path.resolve(import.meta.dirname, '../../..')

  const result = await scanForEncodingIssues({ rootDir })

  if (result.ok) {
    console.log(`UTF-8 check passed: ${rootDir}`)
    return
  }

  console.error(`UTF-8 check failed: ${rootDir}`)
  for (const issue of result.issues) {
    console.error(`- ${path.relative(rootDir, issue.filePath)}: ${issue.reason}`)
  }
  process.exitCode = 1
}

const currentFilePath = fileURLToPath(import.meta.url)
const invokedFilePath = process.argv[1] ? path.resolve(process.argv[1]) : ''

if (currentFilePath === invokedFilePath) {
  await main()
}
