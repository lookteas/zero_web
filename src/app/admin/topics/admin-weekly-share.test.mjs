import assert from 'node:assert/strict'
import test from 'node:test'

import { buildAdminWeeklySharePayload, formatAdminWeeklyShareText } from './admin-weekly-share.mjs'

const decodeEscaped = (value) => JSON.parse(`"${value}"`)
const messageText = (...codes) => decodeEscaped(codes.map((code) => String.fromCharCode(92) + code).join(''))

test('formatAdminWeeklyShareText returns a ready-to-send weekly review message', () => {
  const payload = buildAdminWeeklySharePayload({
    weekStart: '2026-06-01',
    weekDays: [
      {
        date: '2026-06-01',
        title: messageText('u7406', 'u89e3', 'u4e8b', 'u7269', 'u7684', 'u80fd', 'u529b'),
        summary: messageText('u80fd', 'u591f', 'u901a', 'u8fc7', 'u89c2', 'u5bdf', 'u548c', 'u5b66', 'u4e60', 'uff0c', 'u7406', 'u89e3', 'u4e8b', 'u7269', 'u7684', 'u6982', 'u5ff5', 'u548c', 'u539f', 'u7406', 'u3002'),
        isRestDay: false,
        progressNo: 66,
      },
      {
        date: '2026-06-02',
        title: messageText('u7406', 'u89e3', 'u4ed6', 'u4eba', 'u7684', 'u80fd', 'u529b'),
        summary: messageText('u901a', 'u8fc7', 'u89c2', 'u5bdf', 'u3001', 'u503e', 'u542c', 'u548c', 'u76f4', 'u89c9', 'uff0c', 'u80fd', 'u591f', 'u7406', 'u89e3', 'u4ed6', 'u4eba', 'u7684', 'u5fc3', 'u6001', 'u548c', 'u5904', 'u5883', 'u3002'),
        isRestDay: false,
        progressNo: 67,
      },
      {
        date: '2026-06-07',
        title: messageText('u6574', 'u5408', 'u4e0e', 'u89c2', 'u5bdf'),
        summary: '',
        isRestDay: true,
      },
    ],
  })

  assert.equal(formatAdminWeeklyShareText(payload), [
    messageText('u672c', 'u5468', 'u610f', 'u8bc6', 'u5f3a', 'u5ea6', 'u590d', 'u76d8'),
    messageText('u5468', 'u671f', 'uff1a', 'u0032', 'u0030', 'u0032', 'u0036', 'u002d', 'u0030', 'u0036', 'u002d', 'u0030', 'u0031', 'u0020', 'uff5e', 'u0020', 'u0032', 'u0030', 'u0032', 'u0036', 'u002d', 'u0030', 'u0036', 'u002d', 'u0030', 'u0037'),
    '',
    messageText('u5468', 'u4e00', 'u0020', 'u0032', 'u0030', 'u0032', 'u0036', 'u002d', 'u0030', 'u0036', 'u002d', 'u0030', 'u0031'),
    messageText('u7b2c', 'u0020', 'u0036', 'u0036', 'u0020', 'u4e2a', 'u610f', 'u8bc6', 'u5f3a', 'u5ea6', 'u70b9', 'uff1a') + messageText('u7406', 'u89e3', 'u4e8b', 'u7269', 'u7684', 'u80fd', 'u529b'),
    messageText('u590d', 'u76d8', 'u8981', 'u70b9', 'uff1a') + messageText('u80fd', 'u591f', 'u901a', 'u8fc7', 'u89c2', 'u5bdf', 'u548c', 'u5b66', 'u4e60', 'uff0c', 'u7406', 'u89e3', 'u4e8b', 'u7269', 'u7684', 'u6982', 'u5ff5', 'u548c', 'u539f', 'u7406', 'u3002'),
    '',
    messageText('u5468', 'u4e8c', 'u0020', 'u0032', 'u0030', 'u0032', 'u0036', 'u002d', 'u0030', 'u0036', 'u002d', 'u0030', 'u0032'),
    messageText('u7b2c', 'u0020', 'u0036', 'u0037', 'u0020', 'u4e2a', 'u610f', 'u8bc6', 'u5f3a', 'u5ea6', 'u70b9', 'uff1a') + messageText('u7406', 'u89e3', 'u4ed6', 'u4eba', 'u7684', 'u80fd', 'u529b'),
    messageText('u590d', 'u76d8', 'u8981', 'u70b9', 'uff1a') + messageText('u901a', 'u8fc7', 'u89c2', 'u5bdf', 'u3001', 'u503e', 'u542c', 'u548c', 'u76f4', 'u89c9', 'uff0c', 'u80fd', 'u591f', 'u7406', 'u89e3', 'u4ed6', 'u4eba', 'u7684', 'u5fc3', 'u6001', 'u548c', 'u5904', 'u5883', 'u3002'),
    '',
    messageText('u5468', 'u65e5', 'u0020', 'u0032', 'u0030', 'u0032', 'u0036', 'u002d', 'u0030', 'u0036', 'u002d', 'u0030', 'u0037'),
    messageText('u4f11', 'u606f', 'u6574', 'u5408', 'uff1a', 'u6574', 'u5408', 'u4e0e', 'u89c2', 'u5bdf'),
    '',
    messageText('u8bf7', 'u5927', 'u5bb6', 'u56de', 'u770b', 'u672c', 'u5468', 'u7684', 'u7ec3', 'u4e60', 'uff0c', 'u9009', 'u4e00', 'u4e2a', 'u6700', 'u6709', 'u89e6', 'u52a8', 'u7684', 'u70b9', 'u5199', 'u4e0b', 'u590d', 'u76d8', 'u3002'),
  ].join('\n'))
})

test('buildAdminWeeklySharePayload filters empty days and labels paused days', () => {
  const payload = buildAdminWeeklySharePayload({
    weekStart: '2026-06-01',
    weekDays: [
      { date: '2026-06-01', title: '', summary: '', isRestDay: false },
      { date: '2026-06-02', title: messageText('u6682', 'u505c', 'u4e00', 'u5929'), summary: '', isRestDay: false, isPausedDay: true },
    ],
  })

  assert.equal(payload.days.length, 1)
  assert.equal(payload.days[0].statusLabel, messageText('u6682', 'u505c', 'u6574', 'u7406'))
  assert.equal(payload.days[0].weekdayLabel, messageText('u5468', 'u4e8c'))
})
