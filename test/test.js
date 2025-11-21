import { test } from 'node:test'
import assert from 'node:assert'
import Fastify from 'fastify'
import fastifySES from '../index.js'

test('plugin registers and decorates fastify', async (t) => {
  const fastify = Fastify()
  await fastify.register(fastifySES, { defaultFrom: 'test@example.com' })

  assert.ok(fastify.ses)
  assert.strictEqual(typeof fastify.ses.send, 'function')
  assert.strictEqual(typeof fastify.ses.sendRaw, 'function')
  assert.strictEqual(typeof fastify.ses.sendBulk, 'function')

  await fastify.close()
})

test('send validates required parameters', async (t) => {
  const fastify = Fastify()
  await fastify.register(fastifySES, { defaultFrom: 'test@example.com' })

  await assert.rejects(() => fastify.ses.send({ subject: 'Test', html: 'Test' }), /to/)
  await assert.rejects(() => fastify.ses.send({ to: 'user@example.com', html: 'Test' }), /subject/)
  await assert.rejects(() => fastify.ses.send({ to: 'user@example.com', subject: 'Test' }), /"html" or "text"/)

  await fastify.close()
})

test('sendRaw validates required parameters', async (t) => {
  const fastify = Fastify()
  await fastify.register(fastifySES)

  await assert.rejects(() => fastify.ses.sendRaw({}), /rawMessage/)

  await fastify.close()
})

test('sendBulk validates required parameters', async (t) => {
  const fastify = Fastify()
  await fastify.register(fastifySES, { defaultFrom: 'test@example.com' })

  await assert.rejects(() => fastify.ses.sendBulk({ to: 'string', template: 'Test' }), /array/)
  await assert.rejects(() => fastify.ses.sendBulk({ to: [], template: 'Test' }), /non-empty/)
  await assert.rejects(() => fastify.ses.sendBulk({ to: ['user@example.com'] }), /template/)

  await fastify.close()
})
