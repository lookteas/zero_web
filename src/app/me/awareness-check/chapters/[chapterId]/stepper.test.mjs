import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const source = readFileSync(new URL('./stepper.tsx', import.meta.url), 'utf8')

test('awareness chapter stepper saves one point before advancing', () => {
  assert.equal(source.includes('saveAwarenessCheckPointAction'), true)
  assert.equal(source.includes('completeAwarenessCheckChapterAction'), true)
  assert.equal(source.includes('const firstUnfinishedIndex'), true)
  assert.equal(source.includes('该点数值越{point.direction === "lower" ? "低" : "高"}越好'), true)
  assert.equal(source.includes('text-[#4477ce]'), true)
  assert.equal(source.includes('点位简介'), true)
  assert.equal(source.includes('查看完整说明'), true)
  assert.equal(source.includes('上一个'), true)
  assert.equal(source.includes('继续'), true)
  assert.equal(source.includes('index > 0 ? "grid-cols-2" : ""'), true)
  assert.equal(source.includes('退出并保留进度'), true)
  assert.equal(source.includes('min-h-[46px] w-full'), true)
  assert.equal(source.includes('function exitAndKeepProgress()'), true)
  assert.equal(source.includes('可随时返回检测点进行调整'), true)
})
