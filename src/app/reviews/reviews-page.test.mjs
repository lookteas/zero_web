import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const reviewsPage = readFileSync(new URL('./page.tsx', import.meta.url), 'utf8')

test('reviews page keeps review queues and form modules', () => {
  assert.equal(reviewsPage.includes('submitReviewAction'), true)
  assert.equal(reviewsPage.includes('submitRecoveryReviewAction'), true)
  assert.equal(reviewsPage.includes('ReviewResultGroup'), true)
  assert.equal(reviewsPage.includes('ReviewWritingModule'), true)
})

test('reviews page uses share-panel shell around review workbench', () => {
  assert.equal(reviewsPage.includes('overflow-hidden rounded-[28px] border border-[rgba(204,219,212,0.92)]'), true)
  assert.equal(reviewsPage.includes('border-b border-[rgba(205,219,212,0.72)] bg-[radial-gradient(circle_at_top_left,rgba(35,133,117,0.12),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.82)_0%,rgba(246,250,248,0.9)_100%)]'), true)
})

test('reviews page replaces generic page hero with a warm orbit hero section', () => {
  assert.equal(reviewsPage.includes('hideHero'), true)
  assert.equal(reviewsPage.includes('function ReviewsMoodHero('), true)
  assert.equal(reviewsPage.includes('reviews-hero-orbit reviews-hero-orbit-outer'), true)
  assert.equal(reviewsPage.includes('reviews-hero-dot reviews-hero-dot-1'), true)
  assert.equal(reviewsPage.includes('/reviews/history'), true)
})

test('reviews page removes old section-card wrapper around review content', () => {
  assert.equal(reviewsPage.includes('SectionCard title={pageCopy.sectionTitle}'), false)
})

test('reviews page keeps remaining queue hints without corrupted copy', () => {
  assert.equal(reviewsPage.includes('pendingRemainingCount'), true)
  assert.equal(reviewsPage.includes('recoveryRemainingCount'), true)
  assert.equal(reviewsPage.includes('\u67e5\u770b\u590d\u76d8\u5386\u53f2'), true)
  assert.equal(reviewsPage.includes('\u540e\u9762\u8fd8\u6709 ${pendingRemainingCount} \u6761\u5f85\u590d\u76d8'), true)
  assert.equal(reviewsPage.includes('\u540e\u9762\u8fd8\u6709 ${recoveryRemainingCount} \u7ec4\u5f85\u6062\u590d\u590d\u76d8'), true)
  assert.equal(reviewsPage.includes('????'), false)
})


test('reviews page links to dedicated review history page', () => {
  assert.equal(reviewsPage.includes('/reviews/history'), true)
  assert.equal(reviewsPage.includes('PrimaryLinkButton'), true)
})


test('reviews page merges task context into one block without awareness section', () => {
  assert.equal(reviewsPage.includes('\u5f53\u65f6\u7684\u4efb\u52a1\u80cc\u666f'), true)
  assert.equal(reviewsPage.includes('\u5f53\u65f6\u7684\u5361\u70b9'), true)
  assert.equal(reviewsPage.includes('\u5f53\u65f6\u7684\u9a8c\u8bc1\u65b9\u5f0f'), true)
  assert.equal(reviewsPage.includes('\u610f\u8bc6\u5f3a\u5ea6\u63d0\u5347\u70b9'), false)
  assert.equal(reviewsPage.includes('awarenessDetailMap'), false)
})
test('reviews page tightens hero-to-workbench transition', () => {
  assert.equal(reviewsPage.includes('reviews-hero app-surface relative overflow-hidden px-5 pt-6 pb-5 md:px-7 md:pt-7 md:pb-6'), true)
  assert.equal(reviewsPage.includes('flex flex-col gap-3 md:flex-row md:items-end md:justify-between'), true)
})