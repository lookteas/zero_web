import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const homePage = readFileSync(new URL('./page.tsx', import.meta.url), 'utf8')
const statusCard = readFileSync(new URL('../components/status-card.tsx', import.meta.url), 'utf8')
const primaryButton = readFileSync(new URL('../components/primary-button.tsx', import.meta.url), 'utf8')

const unicodeLiteral = (...codes) => codes.map((code) => '\\' + code).join('')
const decodeEscaped = (value) => JSON.parse(`"${value}"`)
const hasCopy = (source, escaped) => source.includes(escaped) || source.includes(decodeEscaped(escaped))

const awarenessQuickEntryTitle = unicodeLiteral('u987a', 'u624b', 'u8bb0', 'u4e0b', 'u4e00', 'u6761', 'u89c9', 'u5bdf')
const cycleHintTitle = unicodeLiteral('u73b0', 'u5728', 'u9700', 'u8981', 'u7559', 'u610f', 'u7684', 'u63d0', 'u9192')
const mergedTodayFocusTitle = unicodeLiteral('u4eca', 'u65e5', 'u4e3b', 'u4efb', 'u52a1')
const oldTodayFocusTitle = unicodeLiteral('u4eca', 'u5929', 'u5148', 'u505a', 'u8fd9', 'u4e00', 'u4ef6', 'u4e8b')
const taskPreviewSummary = unicodeLiteral('u4eca', 'u5929', 'u7684', 'u7ec3', 'u4e60', 'u91cd', 'u70b9')
const historyAction = unicodeLiteral('u770b', 'u770b', 'u8fc7', 'u53bb', 'u7684', 'u6253', 'u5361')
const homeIntroBody = unicodeLiteral('u628a', 'u4eca', 'u5929', 'u7684', 'u91cd', 'u70b9', 'u5199', 'u6e05', 'u695a')

test('home page keeps only status row and today focus content', () => {
  assert.equal(hasCopy(homePage, awarenessQuickEntryTitle), false)
  assert.equal(hasCopy(homePage, cycleHintTitle), false)
  assert.equal(hasCopy(homePage, mergedTodayFocusTitle), true)
  assert.equal(hasCopy(homePage, oldTodayFocusTitle), false)
})

test('home page keeps directive task preview content', () => {
  assert.equal(hasCopy(homePage, mergedTodayFocusTitle), true)
  assert.equal(hasCopy(homePage, taskPreviewSummary), true)
  assert.equal(hasCopy(homePage, historyAction), true)
  assert.equal(hasCopy(homePage, homeIntroBody), false)
})

test('home page uses tighter mobile spacing around the status row and task actions', () => {
  assert.equal(homePage.includes('grid grid-cols-2 gap-2 md:max-w-lg md:gap-3'), true)
  assert.equal(homePage.includes('mt-4 rounded-[24px]'), true)
  assert.equal(homePage.includes('mt-4 flex flex-col gap-2 md:flex-row md:gap-3'), true)
})

test('home page replaces generic page hero with a custom orbit hero section', () => {
  assert.equal(homePage.includes('hideHero'), true)
  assert.equal(homePage.includes('function HomeMoodHero('), true)
  assert.equal(homePage.includes('home-hero-orbit home-hero-orbit-outer'), true)
  assert.equal(homePage.includes('home-hero-dot home-hero-dot-1'), true)
  assert.equal(homePage.includes('正在练习'), true)
})

test('home page adds colored icon accents for status cards and today focus label', () => {
  assert.equal(statusCard.includes('icon?: ReactNode;'), true)
  assert.equal(statusCard.includes('accentClassName?: string;'), true)
  assert.equal(statusCard.includes('badges?: Array<{ label: string; tone?: "primary" | "warning" }>;'), true)
  assert.equal(statusCard.includes('ornamentKind?: "orbit";'), true)
  assert.equal(statusCard.includes('absolute -bottom-6 right-[-6px] h-28 w-28 rounded-full border'), true)
  assert.equal(statusCard.includes('inline-flex flex-wrap gap-2'), true)
  assert.equal(statusCard.includes('bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.9)_0,rgba(255,255,255,0)_38%)]'), true)
  assert.equal(homePage.includes('kind="continuousDays"'), true)
  assert.equal(homePage.includes('kind="pendingReviewCount"'), true)
  assert.equal(homePage.includes('metric={statusItems[0].metric}'), true)
  assert.equal(homePage.includes('unit={statusItems[0].unit}'), true)
  assert.equal(homePage.includes('badges={statusItems[0].badges}'), true)
  assert.equal(homePage.includes('ornamentKind={statusItems[0].ornamentKind}'), true)
  assert.equal(homePage.includes('items-center gap-2.5 text-[18px] font-semibold tracking-[0.01em] text-[var(--primary)]'), true)
  assert.equal(homePage.includes('inline-flex h-8 w-8 items-center justify-center rounded-full'), true)
  assert.equal(homePage.includes('rounded-[28px] border border-[rgba(204,219,212,0.92)]'), true)
  assert.equal(homePage.includes('rounded-[24px] border border-[rgba(210,221,215,0.86)] bg-white/92'), true)
})

test('home page reuses shared primary button styling', () => {
  assert.equal(homePage.includes('PrimaryLinkButton'), true)
  assert.equal(homePage.includes('getFeedbackChrome("secondaryButton")'), true)
  assert.equal(primaryButton.includes('color: "var(--primary-foreground)"'), true)
})
