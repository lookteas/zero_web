import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const mePage = readFileSync(new URL('../page.tsx', import.meta.url), 'utf8')
const page = readFileSync(new URL('./page.tsx', import.meta.url), 'utf8')
const form = readFileSync(new URL('./standardize-form.tsx', import.meta.url), 'utf8')
const actions = readFileSync(new URL('./actions.ts', import.meta.url), 'utf8')

test('personal center links to the hypnosis document standardizer', () => {
  assert.equal(mePage.includes('互催文档优化'), true)
  assert.equal(mePage.includes('href: "/me/hypnosis-documents"'), true)
  assert.equal(mePage.includes('已开放'), true)
})

test('hypnosis document page exposes upload and metadata fields', () => {
  assert.equal(page.includes('互催文档标准化'), true)
  assert.equal(form.includes('name="file"'), true)
  assert.equal(form.includes('accept=".docx'), true)
  assert.equal(form.includes('name="topic"'), true)
  for (const field of ['date', 'duration', 'hostName', 'subjectName']) {
    assert.equal(form.includes(`formData.set("${field}"`), true)
  }
  for (const removedField of ['hostReview', 'subjectReview']) {
    assert.equal(form.includes(removedField), false)
  }
})

test('hypnosis document form analyzes speakers before standardizing', () => {
  assert.equal(actions.includes('/hypnosis-documents/analyze'), true)
  assert.equal(form.includes('analyzeHypnosisDocumentAction'), true)
  assert.equal(form.includes('识别结果'), true)
  for (const label of ['主催', '被催']) {
    assert.equal(form.includes(label), true)
  }
  assert.equal((form.match(/<select/g) || []).length, 1)
  assert.equal(form.includes('analysis.speakers.find((speaker) => speaker.name !== hostName)'), true)
  assert.equal(form.includes('请先选择主催'), true)
})

test('hypnosis document action posts multipart form and downloads returned docx', () => {
  assert.equal(actions.includes('/hypnosis-documents/standardize'), true)
  assert.equal(actions.includes('body: formData'), true)
  assert.equal(form.includes('URL.createObjectURL'), true)
  assert.equal(form.includes('link.download'), true)
})
