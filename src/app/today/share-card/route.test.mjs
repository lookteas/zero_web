import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { buildTodayShareCardSvg } from '../today-share-card.mjs'

const decodeEscaped = (value) => JSON.parse(`"${value}"`)
const textValue = (...codes) => decodeEscaped(codes.map((code) => String.fromCharCode(92) + code).join(''))
const routeSource = readFileSync(new URL('./route.ts', import.meta.url), 'utf8')
const hasCopy = (source, escaped) => source.includes(escaped) || source.includes(decodeEscaped(escaped))

test('buildTodayShareCardSvg returns a privacy-safe svg card', () => {
  const svg = buildTodayShareCardSvg({
    dateLabel: textValue('u0034', 'u6708', 'u0031', 'u0038', 'u65e5'),
    topicTitle: textValue('u9047', 'u5230', 'u538b', 'u529b', 'u65f6', 'u5148', 'u505c', 'u4e00', 'u4e0b', 'u518d', 'u56de', 'u5e94'),
    weakness: textValue('u522b', 'u4eba', 'u4e00', 'u50ac', 'u5c31', 'u5bb9', 'u6613', 'u4e71'),
    improvementPlan: textValue('u5148', 'u505c', 'u4e09', 'u79d2', 'u518d', 'u5f00', 'u53e3'),
    verificationPath: textValue('u4eca', 'u665a', 'u56de', 'u770b', 'u6709', 'u6ca1', 'u6709', 'u81f3', 'u5c11', 'u505a', 'u5230', 'u4e00', 'u6b21'),
  })

  assert.equal(svg.includes('<svg'), true)
  assert.equal(svg.includes(textValue('u0034', 'u6708', 'u0031', 'u0038', 'u65e5')), true)
  assert.equal(svg.includes(textValue('u4eca', 'u65e5', 'u63d0', 'u5347', 'u70b9')), true)
  assert.equal(svg.includes(textValue('u5f53', 'u524d', 'u5361', 'u70b9')), true)
  assert.equal(svg.includes(textValue('u6539', 'u8fdb', 'u884c', 'u52a8')), true)
  assert.equal(svg.includes(textValue('u9a8c', 'u8bc1', 'u65b9', 'u5f0f')), true)
  assert.equal(/Zero|logo/.test(svg), false)
})

test('route file keeps readable chinese fallbacks', () => {
  assert.equal(hasCopy(routeSource, String.raw`今天`), true)
  assert.equal(hasCopy(routeSource, String.raw`当前卡点`), true)
  assert.equal(hasCopy(routeSource, String.raw`认真执行`), true)
  assert.equal(hasCopy(routeSource, String.raw`今晚回看`), true)
})
