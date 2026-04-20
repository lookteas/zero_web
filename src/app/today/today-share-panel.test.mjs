import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const sharePanel = readFileSync(new URL('./today-share-panel.tsx', import.meta.url), 'utf8')

test('today share panel keeps share actions and preview in one compact block', () => {
  assert.equal(sharePanel.includes('topicMeta'), false)
  assert.equal(sharePanel.includes('payload.dateLabel'), false)
  assert.equal(sharePanel.includes('previewLabel'), false)
  assert.equal(sharePanel.includes('actionsLabel'), false)
  assert.equal(sharePanel.includes('panelIntro'), true)
  assert.equal(sharePanel.includes('previewToggleLabel'), true)
  assert.equal(sharePanel.includes('previewToggleHint'), false)
  assert.equal(sharePanel.includes('<details'), true)
  assert.equal(sharePanel.includes('<details open'), false)
  assert.equal(sharePanel.includes('copyIdle'), true)
  assert.equal(sharePanel.includes('imageIdle'), true)
  assert.equal(sharePanel.includes('function CopyButtonIcon()'), true)
  assert.equal(sharePanel.includes('function ImageButtonIcon()'), true)
  assert.equal(sharePanel.includes('gap-2.5'), true)
  assert.equal(sharePanel.includes('aria-hidden="true"'), true)
  assert.equal(sharePanel.includes('flex items-center gap-2.5'), true)
  assert.equal(sharePanel.includes('block={false}'), true)
  assert.equal(sharePanel.includes('min-h-[38px] min-w-0 flex-1 rounded-[16px] px-3 text-[12px]'), true)
  assert.equal(sharePanel.includes('whitespace-nowrap'), true)
  assert.equal(sharePanel.includes('rangeLabel'), false)
  assert.equal(sharePanel.includes('topicLabel'), false)
  assert.equal(sharePanel.includes('weaknessLabel'), false)
  assert.equal(sharePanel.includes('planLabel'), false)
  assert.equal(sharePanel.includes('verificationLabel'), false)
  assert.equal(sharePanel.includes('mt-4 rounded-[18px] border border-[rgba(41,122,106,0.12)] bg-[rgba(243,249,246,0.92)] px-4 py-3 text-[13px] leading-6 text-[var(--foreground-soft)]'), false)
})





