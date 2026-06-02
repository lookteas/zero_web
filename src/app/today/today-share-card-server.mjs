import QRCode from 'qrcode'

import { buildTodayShareCardSvg } from './today-share-card.mjs'

const COPY = {
  qrLabel: '\u626b\u7801\u767b\u5f55',
  qrHint: '\u4e00\u8d77\u5b8c\u6210\u4eca\u65e5\u6253\u5361',
}

function decodeEscaped(value) {
  return JSON.parse(`"${value}"`)
}

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function qrModules(value) {
  const qr = QRCode.create(value, { errorCorrectionLevel: 'M', margin: 0 })
  const size = qr.modules.size
  const data = qr.modules.data
  const quiet = 10
  const cell = (128 - quiet * 2) / size
  const rects = []

  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      if (!data[row * size + col]) {
        continue
      }

      rects.push(
        `<rect data-qr-module="1" x="${(816 + quiet + col * cell).toFixed(2)}" y="${(1162 + quiet + row * cell).toFixed(2)}" width="${cell.toFixed(2)}" height="${cell.toFixed(2)}"/>`,
      )
    }
  }

  return rects.join('')
}

function loginQr(value, theme) {
  const loginUrl = String(value || '/login')
  const label = decodeEscaped(COPY.qrLabel)
  const hint = decodeEscaped(COPY.qrHint)

  return `
    <g data-qr-login-url="${escapeXml(loginUrl)}">
      <rect x="760" y="1140" width="218" height="184" rx="28" fill="${theme.soft}" fill-opacity="0.82" stroke="${theme.softBorder}" stroke-width="2"/>
      <rect x="816" y="1162" width="128" height="128" rx="14" fill="#FFFFFF" stroke="${theme.border}" stroke-width="2"/>
      <g fill="${theme.text}">
        ${qrModules(loginUrl)}
      </g>
      <text x="104" y="1198" fill="${theme.label}" font-size="21" font-weight="500" font-family="'Microsoft YaHei', 'PingFang SC', Arial, sans-serif">${escapeXml(label)}</text>
      <text x="104" y="1242" fill="${theme.text}" font-size="29" font-weight="700" font-family="'Microsoft YaHei', 'PingFang SC', Arial, sans-serif">${escapeXml(hint)}</text>
      <path d="M646 1248C690 1238 718 1214 738 1178" stroke="${theme.accent2}" stroke-width="3" stroke-linecap="round" opacity="0.28"/>
      <path d="M732 1178L742 1164L747 1181" stroke="${theme.accent2}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" opacity="0.28"/>
    </g>
  `
}

export function buildTodayShareCardSvgWithLoginQr(payload) {
  return buildTodayShareCardSvg(payload, {
    footerSlot: (theme) => loginQr(payload.loginUrl, theme),
  })
}
