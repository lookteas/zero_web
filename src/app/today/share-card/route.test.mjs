import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { buildTodayShareCardSvgWithLoginQr as buildTodayShareCardSvg } from '../today-share-card-server.mjs'

const decodeEscaped = (value) => JSON.parse(`"${value}"`)
const textValue = (...codes) => decodeEscaped(codes.map((code) => String.fromCharCode(92) + code).join(''))
const routeSource = readFileSync(new URL('./route.ts', import.meta.url), 'utf8')
const hasCopy = (source, escaped) => source.includes(escaped) || source.includes(decodeEscaped(escaped))
const svgHeight = (svg) => Number(svg.match(/<svg width="1080" height="(\d+)"/)?.[1] || 0)

test('buildTodayShareCardSvg returns a privacy-safe svg card', () => {
  const svg = buildTodayShareCardSvg({
    taskDate: '2026-04-18',
    dateLabel: textValue('u0034', 'u6708', 'u0031', 'u0038', 'u65e5'),
    topicTitle: textValue('u9047', 'u5230', 'u538b', 'u529b', 'u65f6', 'u5148', 'u505c', 'u4e00', 'u4e0b', 'u518d', 'u56de', 'u5e94'),
    topicSummary: textValue('u5148', 'u505c', 'u4e00', 'u4e0b', 'uff0c', 'u518d', 'u51b3', 'u5b9a', 'u600e', 'u4e48', 'u56de', 'u5e94'),
    weakness: textValue('u522b', 'u4eba', 'u4e00', 'u50ac', 'u5c31', 'u5bb9', 'u6613', 'u4e71'),
    improvementPlan: textValue('u5148', 'u505c', 'u4e09', 'u79d2', 'u518d', 'u5f00', 'u53e3'),
    verificationPath: textValue('u4eca', 'u665a', 'u56de', 'u770b', 'u6709', 'u6ca1', 'u6709', 'u81f3', 'u5c11', 'u505a', 'u5230', 'u4e00', 'u6b21'),
  })

  assert.equal(svg.includes('<svg'), true)
  assert.equal(svg.includes(textValue('u0034', 'u6708', 'u0031', 'u0038', 'u65e5')), true)
  assert.equal(svg.includes(textValue('u4eca', 'u5929', 'u7684', 'u610f', 'u8bc6', 'u5f3a', 'u5ea6', 'u63d0', 'u5347')), false)
  assert.equal(svg.includes(textValue('u4e3b', 'u9898', 'u6458', 'u8981')), true)
  assert.equal(svg.includes(textValue('u5148', 'u505c', 'u4e00', 'u4e0b')), true)
  assert.equal(svg.includes(textValue('u5f53', 'u524d', 'u5361', 'u70b9')), true)
  assert.equal(svg.includes(textValue('u6539', 'u8fdb', 'u884c', 'u52a8')), true)
  assert.equal(svg.includes(textValue('u9a8c', 'u8bc1', 'u65b9', 'u5f0f')), true)
  assert.equal(svg.includes('<foreignObject'), false)
  assert.equal(svg.includes('xmlns="http://www.w3.org/1999/xhtml"'), false)
  assert.equal(svg.includes('font-family=""'), false)
  assert.equal(svg.includes('font-size="28" font-weight="500"'), true)
  assert.equal(svg.includes('font-size="34" font-weight="600"'), false)
  assert.equal(/<rect x="40" y="40"[^>]*fill="#[A-F0-9]+"/.test(svg), true)
  assert.equal(svg.includes('<rect x="104" y="232" width="139" height="4" rx="2" fill="url(#accent)"/>'), true)
  assert.equal(svg.includes('fill="url(#summaryFade)"'), true)
  assert.equal(/<stop stop-color="#[A-F0-9]+"/.test(svg), true)
  assert.equal(svg.includes('<line x1="104"'), true)
  assert.equal(/Zero|logo/.test(svg), false)
})

test('buildTodayShareCardSvg uses stable daily visual variants', () => {
  const basePayload = {
    dateLabel: textValue('u0034', 'u6708', 'u0031', 'u0038', 'u65e5'),
    topicTitle: textValue('u4e00', 'u4e2a', 'u5f88', 'u957f', 'u7684', 'u4e3b', 'u9898', 'u540d', 'u79f0', 'u9700', 'u8981', 'u81ea', 'u52a8', 'u8c03', 'u6574', 'u5b57', 'u53f7'),
    topicSummary: textValue('u5148', 'u628a', 'u8fd9', 'u6761', 'u6458', 'u8981', 'u8bb2', 'u6e05', 'u695a'),
    weakness: textValue('u5f53', 'u524d', 'u5361', 'u70b9'),
    improvementPlan: textValue('u6539', 'u8fdb', 'u884c', 'u52a8'),
    verificationPath: textValue('u9a8c', 'u8bc1', 'u65b9', 'u5f0f'),
  }
  const first = buildTodayShareCardSvg({ ...basePayload, taskDate: '2026-04-18' })
  const sameDay = buildTodayShareCardSvg({ ...basePayload, taskDate: '2026-04-18' })
  const nextDay = buildTodayShareCardSvg({ ...basePayload, taskDate: '2026-04-19' })

  assert.equal(first, sameDay)
  assert.notEqual(first.match(/<stop stop-color="#[A-F0-9]+"/)?.[0], nextDay.match(/<stop stop-color="#[A-F0-9]+"/)?.[0])
  assert.equal(/font-size="(3[6-9]|4[0-9])" font-weight="700"[^>]*>一个很长/.test(first), true)
  assert.equal(/font-size="27" font-weight="600"[^>]*><tspan x="166" dy="0">先把这条摘要/.test(first), true)
  assert.equal(/data-card-footer="daily-quote"[^>]*font-size="22"/.test(first), true)
})

test('buildTodayShareCardSvg wraps long topic summary inside the summary block', () => {
  const svg = buildTodayShareCardSvg({
    taskDate: '2026-05-07',
    dateLabel: textValue('u0035', 'u6708', 'u0037', 'u65e5'),
    topicTitle: textValue('u771f', 'u5b9e', 'u8868', 'u8fbe', 'u7684', 'u80fd', 'u529b'),
    topicSummary: textValue('u4e0e', 'u4eba', 'u6c9f', 'u901a', 'u4e2d', 'u80fd', 'u5426', 'u771f', 'u5b9e', 'u76f4', 'u63a5', 'u8868', 'u8fbe', 'u81ea', 'u5df1', 'u7684', 'u60f3', 'u6cd5', 'u3002', 'u6bd4', 'u5982', 'uff1a', 'u65e2', 'u80fd', 'u7531', 'u8877', 'u8d5e', 'u7f8e', 'u522b', 'u4eba', 'uff0c', 'u4e5f', 'u80fd', 'u8bda', 'u6073', 'u63d0', 'u51fa', 'u95ee', 'u9898'),
    weakness: textValue('u5f53', 'u524d', 'u5361', 'u70b9'),
    improvementPlan: textValue('u6539', 'u8fdb', 'u884c', 'u52a8'),
    verificationPath: textValue('u9a8c', 'u8bc1', 'u65b9', 'u5f0f'),
  })

  assert.equal(/<text x="166" y="392"[^>]*><tspan x="166" dy="0">/.test(svg), true)
  assert.equal(svg.includes('<tspan x="166" dy="40">'), true)
  assert.equal(svg.includes('id="summaryFade"'), true)
  assert.equal(/<path d="M104 342H816C842 342 922 364 922 390V470H104Z"/.test(svg), true)
  assert.equal(svg.includes('fill="url(#summaryFade)"'), true)
  assert.equal(svg.includes('stroke="${theme.softBorder}"'), false)
  assert.equal(/<text x="166"[^>]*>与人沟通中能否真实直接表达自己的想法。比如：既能由衷赞美别人/.test(svg), false)
})

test('buildTodayShareCardSvg uses a refined top-right ornament', () => {
  const svg = buildTodayShareCardSvg({
    taskDate: '2026-05-07',
    dateLabel: textValue('u0035', 'u6708', 'u0037', 'u65e5'),
    topicTitle: textValue('u771f', 'u5b9e', 'u8868', 'u8fbe', 'u7684', 'u80fd', 'u529b'),
    topicSummary: textValue('u4e3b', 'u9898', 'u6458', 'u8981'),
    weakness: textValue('u5f53', 'u524d', 'u5361', 'u70b9'),
    improvementPlan: textValue('u6539', 'u8fdb', 'u884c', 'u52a8'),
    verificationPath: textValue('u9a8c', 'u8bc1', 'u65b9', 'u5f0f'),
  })

  assert.equal(svg.includes('id="ornamentGlow"'), true)
  assert.equal(svg.includes('stroke-dasharray="6 16"'), true)
  assert.equal(svg.includes('<path d="M838 112C888 88 948 96 990 136"'), true)
  assert.equal(svg.includes('<circle cx="928" cy="142" r="64"'), true)
})

test('buildTodayShareCardSvg includes a spacious scannable login qr invitation', () => {
  const loginUrl = 'https://zero.example.com/login'
  const svg = buildTodayShareCardSvg({
    taskDate: '2026-05-07',
    dateLabel: textValue('u0035', 'u6708', 'u0037', 'u65e5'),
    topicTitle: textValue('u771f', 'u5b9e', 'u8868', 'u8fbe', 'u7684', 'u80fd', 'u529b'),
    topicSummary: textValue('u4e3b', 'u9898', 'u6458', 'u8981'),
    weakness: textValue('u5f53', 'u524d', 'u5361', 'u70b9'),
    improvementPlan: textValue('u6539', 'u8fdb', 'u884c', 'u52a8'),
    verificationPath: textValue('u9a8c', 'u8bc1', 'u65b9', 'u5f0f'),
    loginUrl,
  })

  assert.equal(svg.includes('data-qr-login-url="https://zero.example.com/login"'), true)
  assert.equal(svg.includes(textValue('u626b', 'u7801', 'u767b', 'u5f55')), true)
  assert.equal((svg.match(/data-qr-module="1"/g) || []).length > 120, true)
  assert.equal(svg.includes('data-section="login-qr"'), true)
  assert.equal(svg.includes('data-footer-login-panel="section"'), true)
  assert.equal(svg.includes('data-fixed-footer-login-panel'), false)
  assert.equal(svg.includes(loginUrl), true)
})

test('buildTodayShareCardSvg lays out long content with dynamic card height', () => {
  const shortSvg = buildTodayShareCardSvg({
    taskDate: '2026-05-07',
    dateLabel: textValue('u0035', 'u6708', 'u0037', 'u65e5'),
    topicTitle: textValue('u7406', 'u89e3', 'u4ed6', 'u4eba', 'u7684', 'u80fd', 'u529b'),
    topicSummary: textValue('u4e3b', 'u9898', 'u6458', 'u8981'),
    weakness: textValue('u5f53', 'u524d', 'u5361', 'u70b9'),
    improvementPlan: textValue('u6539', 'u8fdb', 'u884c', 'u52a8'),
    verificationPath: textValue('u9a8c', 'u8bc1', 'u65b9', 'u5f0f'),
    loginUrl: 'https://zero.example.com/login',
  })
  const longSvg = buildTodayShareCardSvg({
    taskDate: '2026-05-07',
    dateLabel: textValue('u0035', 'u6708', 'u0037', 'u65e5'),
    topicTitle: textValue('u7406', 'u89e3', 'u4ed6', 'u4eba', 'u7684', 'u80fd', 'u529b'),
    topicSummary: textValue('u901a', 'u8fc7', 'u89c2', 'u5bdf', 'u3001', 'u503e', 'u542c', 'u548c', 'u76f4', 'u89c9', 'uff0c', 'u80fd', 'u591f', 'u7406', 'u89e3', 'u4ed6', 'u4eba', 'u7684', 'u5fc3', 'u6001', 'u548c', 'u5904', 'u5883', 'u3002'),
    weakness: textValue('u73b0', 'u5728', 'u8ddf', 'u4eba', 'u4ea4', 'u6d41', 'u6709', 'u65f6', 'u5019', 'u4f1a', 'u4e0d', 'u8010', 'u70e6', 'uff0c', 'u6f5c', 'u610f', 'u8bc6', 'u91cc', 'u89c9', 'u5f97', 'u95ee', 'u9898', 'u5f88', 'u7b80', 'u5355', 'u5bf9', 'u65b9', 'u600e', 'u4e48', 'u56de', 'u7b54', 'u4e0d', 'u51fa', 'u6765', 'uff0c', 'u6216', 'u8005', 'u5bf9', 'u65b9', 'u7684', 'u7b54', 'u590d', 'u6211', 'u4e0d', 'u6ee1', 'u610f', 'u5f88', 'u591a', 'u65f6', 'u5019', 'u4f1a', 'u6709', 'u6025', 'u8e81', 'u60c5', 'u7eea'),
    improvementPlan: '1、深度挖掘自己的卡点，如不耐烦和急躁，背后的深层原因的是什么，是否自我设了一个标准，此外还有无其他隐藏的点未被发现，并且把今天最容易触发急躁的真实场景写下来，再补一句观察触发前后的身体反应。2、培养倾听他人的习惯，并尊重他人的观点和感受。通过倾听他人的心声，看见对方真实的处境。3、交流前先停三秒，确认自己是在理解对方，而不是急着评价或纠正对方。',
    verificationPath: textValue('u5728', 'u4e0e', 'u670b', 'u53cb', 'u548c', 'u540c', 'u4e8b', 'u4ea4', 'u5f80', 'u4e2d', 'u89c2', 'u5bdf', 'u4e00', 'u6bb5', 'u65f6', 'u95f4', 'uff0c', 'u770b', 'u770b', 'u81ea', 'u5df1', 'u7684', 'u4eba', 'u9645', 'u5173', 'u7cfb', 'u662f', 'u5426', 'u6709', 'u660e', 'u663e', 'u63d0', 'u5347', 'uff0c', 'u81ea', 'u5df1', 'u5728', 'u4e0e', 'u4ed6', 'u4eba', 'u5bf9', 'u8bdd', 'u4ea4', 'u6d41', 'u8fc7', 'u7a0b', 'u4e2d', 'u662f', 'u5426', 'u8fd8', 'u6709', 'u660e', 'u663e', 'u7684', 'u60c5', 'u7eea', 'u6ce2', 'u52a8'),
    loginUrl: 'https://zero.example.com/login',
  })

  assert.equal(svgHeight(shortSvg) >= 1350, true)
  assert.equal(svgHeight(longSvg) > svgHeight(shortSvg), true)
  assert.equal(longSvg.includes('data-list-section="improvementPlan"'), true)
  assert.equal(longSvg.includes('data-list-index="1"'), true)
  assert.equal(longSvg.includes('data-list-index="2"'), true)
  assert.equal(longSvg.includes('data-list-index="3"'), true)
  assert.equal(longSvg.includes('未被发现。2、培养'), false)
  assert.equal(longSvg.includes('data-truncated-list-item="1"'), true)
  assert.equal(longSvg.includes('...'), true)
})

test('route uses configured public site url for default login qr target', () => {
  assert.equal(routeSource.includes('NEXT_PUBLIC_SITE_URL'), true)
  assert.equal(routeSource.includes("new URL('/login', publicSiteUrl)"), true)
})

test('route file keeps readable chinese fallbacks', () => {
  assert.equal(hasCopy(routeSource, String.raw`今天`), true)
  assert.equal(hasCopy(routeSource, String.raw`重点概要`), true)
  assert.equal(hasCopy(routeSource, String.raw`当前卡点`), true)
  assert.equal(hasCopy(routeSource, String.raw`认真执行`), true)
  assert.equal(hasCopy(routeSource, String.raw`今晚回看`), true)
})
