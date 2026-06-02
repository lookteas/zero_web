import QRCode from 'qrcode'

import { buildTodayShareCardSvg } from './today-share-card.mjs'

const COPY = {
  qrLabel: '\u626b\u7801\u767b\u5f55',
  qrHint: '\u4e00\u8d77\u5b8c\u6210\u4eca\u65e5\u6253\u5361',
  qrNote: '\u6253\u5f00\u540e\u76f4\u63a5\u767b\u5f55\u8bb0\u5f55',
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

function qrModules(value, origin) {
  const qr = QRCode.create(value, { errorCorrectionLevel: 'M', margin: 0 })
  const size = qr.modules.size
  const data = qr.modules.data
  const quiet = 10
  const cell = (124 - quiet * 2) / size
  const rects = []

  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      if (!data[row * size + col]) {
        continue
      }

      rects.push(
        `<rect data-qr-module="1" x="${(origin.x + quiet + col * cell).toFixed(2)}" y="${(origin.y + quiet + row * cell).toFixed(2)}" width="${cell.toFixed(2)}" height="${cell.toFixed(2)}"/>`,
      )
    }
  }

  return rects.join('')
}

function loginQr(value, theme, layout = {}) {
  const loginUrl = String(value || '/login')
  const label = decodeEscaped(COPY.qrLabel)
  const hint = decodeEscaped(COPY.qrHint)
  const note = decodeEscaped(COPY.qrNote)
  const y = Number(layout.y || 1140)
  const panelY = y + 36
  const qrX = 820
  const qrY = panelY + 22

  return `
    <g data-section="login-qr" data-qr-login-url="${escapeXml(loginUrl)}" data-footer-login-panel="section">
      <circle cx="106" cy="${y - 8}" r="5" fill="${theme.accent}"/>
      <text x="126" y="${y}" fill="${theme.label}" font-size="21" font-weight="500" font-family="'Microsoft YaHei', 'PingFang SC', Arial, sans-serif">${escapeXml(label)}</text>
      <rect x="104" y="${panelY}" width="872" height="170" rx="30" fill="${theme.soft}" fill-opacity="0.78" stroke="${theme.softBorder}" stroke-width="2"/>
      <path d="M662 ${panelY + 48}C704 ${panelY + 20} 758 ${panelY + 18} 806 ${panelY + 42}" stroke="${theme.accent}" stroke-width="3" stroke-linecap="round" opacity="0.13"/>
      <path d="M642 ${panelY + 122}C700 ${panelY + 150} 766 ${panelY + 148} 812 ${panelY + 112}" stroke="${theme.accent2}" stroke-width="3" stroke-linecap="round" opacity="0.12"/>
      <rect x="${qrX}" y="${qrY}" width="124" height="124" rx="16" fill="#FFFFFF" stroke="${theme.border}" stroke-width="2"/>
      <g fill="${theme.text}">
        ${qrModules(loginUrl, { x: qrX, y: qrY })}
      </g>
      <text x="144" y="${panelY + 70}" fill="${theme.text}" font-size="30" font-weight="700" font-family="'Microsoft YaHei', 'PingFang SC', Arial, sans-serif">${escapeXml(hint)}</text>
      <text x="144" y="${panelY + 112}" fill="${theme.footer}" font-size="21" font-weight="600" font-family="'Microsoft YaHei', 'PingFang SC', Arial, sans-serif">${escapeXml(note)}</text>
      <path d="M690 ${panelY + 132}C734 ${panelY + 126} 770 ${panelY + 96} 802 ${panelY + 52}" stroke="${theme.accent2}" stroke-width="3" stroke-linecap="round" opacity="0.22"/>
      <path d="M798 ${panelY + 54}L813 ${panelY + 42}L813 ${panelY + 61}" stroke="${theme.accent2}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" opacity="0.22"/>
    </g>
  `
}

export function buildTodayShareCardSvgWithLoginQr(payload) {
  return buildTodayShareCardSvg(payload, {
    footerSlot: (theme, layout) => loginQr(payload.loginUrl, theme, layout),
    footerSlotHeight: 238,
  })
}
