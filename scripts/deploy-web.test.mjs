import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const source = readFileSync(new URL('./deploy-web.ps1', import.meta.url), 'utf8')
const readme = readFileSync(new URL('../README.md', import.meta.url), 'utf8')

test('deploy-web script uploads a filtered archive over ssh', () => {
  assert.equal(source.includes('HostName'), true)
  assert.equal(source.includes('UserName'), true)
  assert.equal(source.includes('RemotePath'), true)
  assert.equal(source.includes('InstallDependencies'), true)
  assert.equal(source.includes('BuildOnServer'), true)
  assert.equal(source.includes('--exclude=.next'), true)
  assert.equal(source.includes('--exclude=node_modules'), true)
  assert.equal(source.includes('& scp'), true)
  assert.equal(source.includes('& ssh'), true)
})

test('readme documents deploy-web usage', () => {
  assert.equal(readme.includes('scripts/deploy-web.ps1'), true)
  assert.equal(readme.includes('InstallDependencies'), true)
  assert.equal(readme.includes('BuildOnServer'), true)
})
