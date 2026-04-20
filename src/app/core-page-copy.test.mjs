import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const todayPage = readFileSync(new URL('./today/page.tsx', import.meta.url), 'utf8')
const logsPage = readFileSync(new URL('./logs/page.tsx', import.meta.url), 'utf8')
const reviewsPage = readFileSync(new URL('./reviews/page.tsx', import.meta.url), 'utf8')

const unicodeLiteral = (...codes) => codes.map((code) => '\\' + code).join('')
const decodeEscaped = (value) => JSON.parse(`"${value}"`)

const stateText = decodeEscaped(unicodeLiteral('u5f53', 'u524d', 'u72b6', 'u6001'))
const savedText = decodeEscaped(unicodeLiteral('u4eca', 'u5929', 'u7684', 'u6253', 'u5361', 'u5185', 'u5bb9', 'u5df2', 'u4fdd', 'u5b58', 'u3002'))
const submittedTodayText = decodeEscaped(unicodeLiteral('u4eca', 'u5929', 'u7684', 'u6253', 'u5361', 'u5df2', 'u63d0', 'u4ea4', 'u3002'))
const submittedReviewText = decodeEscaped(unicodeLiteral('u8fd9', 'u6b21', 'u590d', 'u76d8', 'u5df2', 'u7ecf', 'u8bb0', 'u4e0b', 'u6765', 'u4e86', 'u3002'))
const todayAwarenessTitleLiteral = unicodeLiteral('u4eca', 'u5929', 'u5df2', 'u7ecf', 'u8bb0', 'u4e0b', 'u7684', 'u89c9', 'u5bdf')
const logsAwarenessTitleLiteral = unicodeLiteral('u6700', 'u8fd1', 'u8bb0', 'u4e0b', 'u7684', 'u89c9', 'u5bdf')

const mojibakeState = Buffer.from([0xe5, 0xbd, 0x93, 0xe5, 0x89, 0x8d, 0xe7, 0x8a, 0xb6, 0xe6, 0x80, 0x81]).toString('latin1')
const mojibakeToday = Buffer.from([0xe4, 0xbb, 0x8a, 0xe5, 0xa4, 0xa9, 0xe7, 0x9a, 0x84, 0xe6, 0x89, 0x93, 0xe5, 0x8d, 0xa1]).toString('latin1')
const mojibakeReview = Buffer.from([0xe8, 0xbf, 0x99, 0xe6, 0xac, 0xa1, 0xe5, 0xa4, 0x8d, 0xe7, 0x9b, 0x98]).toString('latin1')

test('core workbench pages keep key Chinese copy readable', () => {
  assert.equal(todayPage.includes(stateText), true)
  assert.equal(todayPage.includes(savedText), true)
  assert.equal(todayPage.includes(submittedTodayText), true)

  assert.equal(logsPage.includes(stateText), true)

  assert.equal(reviewsPage.includes(stateText), true)
  assert.equal(reviewsPage.includes(submittedReviewText), true)
})

test('core workbench pages do not keep mojibake remnants', () => {
  assert.equal(todayPage.includes(mojibakeState), false)
  assert.equal(todayPage.includes(mojibakeToday), false)
  assert.equal(logsPage.includes(mojibakeState), false)
  assert.equal(reviewsPage.includes(mojibakeState), false)
  assert.equal(reviewsPage.includes(mojibakeReview), false)
})

test('core workbench pages do not keep literal unicode escape copy in JSX', () => {
  assert.equal(todayPage.includes(todayAwarenessTitleLiteral), false)
  assert.equal(logsPage.includes(logsAwarenessTitleLiteral), false)
  assert.equal(reviewsPage.includes('title="' + '\\u'), false)
})
