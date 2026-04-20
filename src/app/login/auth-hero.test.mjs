import test from 'node:test'
import assert from 'node:assert/strict'

import { getAuthHeroContent } from './auth-hero.mjs'

test('getAuthHeroContent returns the approved growth-app auth structure', () => {
  const hero = getAuthHeroContent()

  assert.equal(hero.title, '慢一点，也没关系')
  assert.match(hero.description, /今天真正重要的一件事/)
  assert.deepEqual(hero.actions, ['登录', '注册'])
})
