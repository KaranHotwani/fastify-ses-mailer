import 'dotenv/config'
import Fastify from 'fastify'
import fastifySES from '../index.js'

const fastify = Fastify({ logger: true })

await fastify.register(fastifySES, {
  region: process.env.AWS_REGION,
  defaultFrom: process.env.SES_FROM_EMAIL
})

async function runExamples () {
  try {
    const result1 = await fastify.ses.send({
      to: 'recipient@example.com',
      subject: 'Hello from Fastify SES',
      html: '<h1>Hello!</h1><p>This is a test email.</p>',
      text: 'Hello! This is a test email.'
    })
    console.log('Email sent:', result1.MessageId)

    const rawEmail = `From: sender@example.com
To: recipient@example.com
Subject: Raw Email Test
MIME-Version: 1.0
Content-Type: text/plain; charset=UTF-8

This is a raw MIME email message.`

    const result2 = await fastify.ses.sendRaw({
      rawMessage: rawEmail
    })
    console.log('Raw email sent:', result2.MessageId)

    const result3 = await fastify.ses.sendBulk({
      to: ['user1@example.com', 'user2@example.com'],
      template: 'WelcomeEmail',
      defaultTemplateData: { company: 'Acme Corp' },
      bulkTemplateData: [
        { name: 'Alice', discount: '20%' },
        { name: 'Bob', discount: '15%' }
      ]
    })
    console.log('Bulk emails sent:', result3.Status)
  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await fastify.close()
  }
}

runExamples()
