import assert from 'node:assert/strict'
import test from 'node:test'

import { buildTodaySharePayload, formatTodayShareText } from './today-share.mjs'

const decodeEscaped = (value) => JSON.parse(`"${value}"`)
const messageText = (...codes) => decodeEscaped(codes.map((code) => String.fromCharCode(92) + code).join(''))

test('formatTodayShareText returns a ready-to-send group message', () => {
  const payload = buildTodaySharePayload({
    taskDate: '2026-04-18',
    topicTitle: messageText('u9047', 'u5230', 'u538b', 'u529b', 'u65f6', 'u5148', 'u505c', 'u4e00', 'u4e0b', 'u518d', 'u56de', 'u5e94'),
    topicSummary: messageText('u5148', 'u505c', 'u4e00', 'u4e0b', 'uff0c', 'u518d', 'u51b3', 'u5b9a', 'u600e', 'u4e48', 'u56de', 'u5e94'),
    weakness: messageText('u522b', 'u4eba', 'u4e00', 'u50ac', 'u5c31', 'u5bb9', 'u6613', 'u4e71'),
    improvementPlan: messageText('u5148', 'u505c', 'u4e09', 'u79d2', 'u518d', 'u5f00', 'u53e3'),
    verificationPath: messageText('u4eca', 'u665a', 'u56de', 'u770b', 'u6709', 'u6ca1', 'u6709', 'u81f3', 'u5c11', 'u505a', 'u5230', 'u4e00', 'u6b21'),
  })

  assert.equal(payload.dateLabel, messageText('u0034', 'u6708', 'u0031', 'u0038', 'u65e5'))
  assert.equal(formatTodayShareText(payload), [
    messageText('u0034', 'u6708', 'u0031', 'u0038', 'u65e5', 'u610f', 'u8bc6', 'u5f3a', 'u5ea6', 'u63d0', 'u5347'),
    '',
    messageText('u4eca', 'u65e5', 'u63d0', 'u5347', 'u70b9', 'uff1a') + messageText('u9047', 'u5230', 'u538b', 'u529b', 'u65f6', 'u5148', 'u505c', 'u4e00', 'u4e0b', 'u518d', 'u56de', 'u5e94'),
    messageText('u6458', 'u8981', 'uff1a') + messageText('u5148', 'u505c', 'u4e00', 'u4e0b', 'uff0c', 'u518d', 'u51b3', 'u5b9a', 'u600e', 'u4e48', 'u56de', 'u5e94'),
    '',
    messageText('u5f53', 'u524d', 'u5361', 'u70b9', 'uff1a') + '\n' + messageText('u522b', 'u4eba', 'u4e00', 'u50ac', 'u5c31', 'u5bb9', 'u6613', 'u4e71'),
    '',
    messageText('u6539', 'u8fdb', 'u884c', 'u52a8', 'uff1a') + '\n' + messageText('u5148', 'u505c', 'u4e09', 'u79d2', 'u518d', 'u5f00', 'u53e3'),
    '',
    messageText('u9a8c', 'u8bc1', 'u65b9', 'u5f0f', 'uff1a') + '\n' + messageText('u4eca', 'u665a', 'u56de', 'u770b', 'u6709', 'u6ca1', 'u6709', 'u81f3', 'u5c11', 'u505a', 'u5230', 'u4e00', 'u6b21'),
  ].join('\n'))
})

test('buildTodaySharePayload provides restrained fallbacks for empty fields', () => {
  const payload = buildTodaySharePayload({
    taskDate: '2026-04-18',
    topicTitle: messageText('u5148', 'u628a', 'u6ce8', 'u610f', 'u529b', 'u6536', 'u56de', 'u6765'),
    topicSummary: '',
    weakness: '',
    improvementPlan: '',
    verificationPath: '',
  })

  assert.equal(payload.topicSummary, messageText('u5148', 'u628a', 'u8fd9', 'u6761', 'u610f', 'u8bc6', 'u63d0', 'u5347', 'u70b9', 'u7684', 'u91cd', 'u70b9', 'u6982', 'u8981', 'u5199', 'u6e05', 'u695a'))
  assert.equal(payload.weakness, messageText('u4eca', 'u5929', 'u5148', 'u628a', 'u6ce8', 'u610f', 'u529b', 'u653e', 'u56de', 'u6b63', 'u5728', 'u7ec3', 'u7684', 'u8fd9', 'u4e00', 'u70b9'))
  assert.equal(payload.improvementPlan, messageText('u5148', 'u628a', 'u4eca', 'u5929', 'u51c6', 'u5907', 'u6267', 'u884c', 'u7684', 'u52a8', 'u4f5c', 'u8ba4', 'u771f', 'u505a', 'u5b8c'))
  assert.equal(payload.verificationPath, messageText('u4eca', 'u665a', 'u56de', 'u770b', 'u65f6', 'u786e', 'u8ba4', 'u81ea', 'u5df1', 'u662f', 'u5426', 'u771f', 'u7684', 'u505a', 'u5230', 'u4e86'))
})
