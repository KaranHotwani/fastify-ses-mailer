import fp from 'fastify-plugin'
import { SESClient, SendEmailCommand, SendRawEmailCommand, SendBulkTemplatedEmailCommand } from '@aws-sdk/client-ses'

async function fastifySES (fastify, opts = {}) {
  const { region = process.env.AWS_REGION || 'us-east-1', defaultFrom = process.env.SES_FROM_EMAIL || null } = opts

  const sesClient = new SESClient({ region })

  const send = async ({ from, to, subject, html, text }) => {
    if (!to) {
      throw new Error('send requires "to" parameter')
    }
    if (!subject) {
      throw new Error('send requires "subject" parameter')
    }
    if (!html && !text) {
      throw new Error('send requires at least one of "html" or "text" parameter')
    }
    const source = from || defaultFrom
    if (!source) {
      throw new Error('send requires "from" parameter or defaultFrom option')
    }

    const params = {
      Source: source,
      Destination: {
        ToAddresses: Array.isArray(to) ? to : [to]
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: 'UTF-8'
        },
        Body: {}
      }
    }

    if (html) {
      params.Message.Body.Html = {
        Data: html,
        Charset: 'UTF-8'
      }
    }

    if (text) {
      params.Message.Body.Text = {
        Data: text,
        Charset: 'UTF-8'
      }
    }

    const command = new SendEmailCommand(params)
    return sesClient.send(command)
  }

  const sendRaw = async ({ rawMessage }) => {
    if (!rawMessage) {
      throw new Error('sendRaw requires "rawMessage" parameter')
    }

    const params = {
      RawMessage: {
        Data: Buffer.isBuffer(rawMessage) ? rawMessage : Buffer.from(rawMessage)
      }
    }

    const command = new SendRawEmailCommand(params)
    return sesClient.send(command)
  }

  const sendBulk = async ({ from, to, template, defaultTemplateData = {}, bulkTemplateData = [] }) => {
    if (!Array.isArray(to) || to.length === 0) {
      throw new Error('sendBulk requires "to" parameter to be a non-empty array')
    }
    if (!template) {
      throw new Error('sendBulk requires "template" parameter')
    }
    const source = from || defaultFrom
    if (!source) {
      throw new Error('sendBulk requires "from" parameter or defaultFrom option')
    }

    const destinations = to.map((email, index) => ({
      Destination: {
        ToAddresses: [email]
      },
      ReplacementTemplateData: bulkTemplateData[index]
        ? JSON.stringify(bulkTemplateData[index])
        : JSON.stringify({})
    }))

    const params = {
      Source: source,
      Template: template,
      DefaultTemplateData: JSON.stringify(defaultTemplateData),
      Destinations: destinations
    }

    const command = new SendBulkTemplatedEmailCommand(params)
    return sesClient.send(command)
  }

  fastify.decorate('ses', {
    send,
    sendRaw,
    sendBulk
  })
}

export default fp(fastifySES, {
  name: 'fastify-ses',
  fastify: '5.x'
})
