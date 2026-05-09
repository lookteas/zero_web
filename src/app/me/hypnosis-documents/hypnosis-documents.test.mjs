import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const mePage = readFileSync(new URL('../page.tsx', import.meta.url), 'utf8')
const page = readFileSync(new URL('./page.tsx', import.meta.url), 'utf8')
const form = readFileSync(new URL('./standardize-form.tsx', import.meta.url), 'utf8')
const actions = readFileSync(new URL('./actions.ts', import.meta.url), 'utf8')

test('personal center links to the hypnosis document standardizer', () => {
  assert.equal(mePage.includes('潜催文档优化'), true)
  assert.equal(mePage.includes('href: "/me/hypnosis-documents"'), true)
  assert.equal(mePage.includes('可使用'), true)
})

test('hypnosis document page exposes upload and metadata fields', () => {
  assert.equal(page.includes('潜催文档标准化'), true)
  assert.equal(form.includes('name="file"'), true)
  assert.equal(form.includes('accept=".docx'), true)
  for (const field of ['topic', 'date', 'duration', 'hostName', 'subjectName', 'hostReview', 'subjectReview']) {
    assert.equal(form.includes(`name="${field}"`), true)
  }
})

test('hypnosis document action posts multipart form and downloads returned docx', () => {
  assert.equal(actions.includes('/hypnosis-documents/standardize'), true)
  assert.equal(actions.includes('body: formData'), true)
  assert.equal(form.includes('URL.createObjectURL'), true)
  assert.equal(form.includes('link.download'), true)
})
