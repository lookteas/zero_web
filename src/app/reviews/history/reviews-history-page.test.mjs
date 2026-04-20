import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const reviewsHistoryPage = readFileSync(new URL('./page.tsx', import.meta.url), 'utf8')

test('reviews history page fetches review history and keeps cards collapsed by default', () => {
  assert.equal(reviewsHistoryPage.includes('listReviewHistoryRecords'), true)
  assert.equal(reviewsHistoryPage.includes('<details'), true)
  assert.equal(reviewsHistoryPage.includes('openRecordId'), true)
})

test('reviews history page provides filters and navigation links', () => {
  assert.equal(reviewsHistoryPage.includes('startDate'), true)
  assert.equal(reviewsHistoryPage.includes('endDate'), true)
  assert.equal(reviewsHistoryPage.includes('keyword'), true)
  assert.equal(reviewsHistoryPage.includes('/reviews'), true)
})
