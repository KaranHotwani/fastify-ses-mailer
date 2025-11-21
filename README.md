# fastify-ses-mailer

Fastify plugin for sending emails via AWS SES using AWS SDK v3.

## Installation

```bash
npm install fastify-ses-mailer fastify@^5.0.0
```

## Usage

```js
import Fastify from 'fastify'
import fastifySES from 'fastify-ses-mailer'

const fastify = Fastify()

await fastify.register(fastifySES, {
  region: 'us-east-1',
  defaultFrom: 'sender@example.com'
})
```

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `region` | string | `process.env.AWS_REGION` or `'us-east-1'` | AWS region |
| `defaultFrom` | string | `process.env.SES_FROM_EMAIL` | Default sender email |

## AWS Credentials

Set environment variables:
```bash
export AWS_REGION=us-east-1
export AWS_ACCESS_KEY_ID=your_key
export AWS_SECRET_ACCESS_KEY=your_secret
export SES_FROM_EMAIL=sender@example.com
```

Or use IAM roles, `~/.aws/credentials`, or AWS SSO.

## API

### `fastify.ses.send(options)`

Send HTML or text emails.

```js
await fastify.ses.send({
  to: 'user@example.com',
  subject: 'Hello',
  html: '<h1>Hi!</h1>',
  text: 'Hi!'
})
```

**Options:**
- `from` (string, optional): Sender email
- `to` (string | string[]): Recipient(s)
- `subject` (string): Email subject
- `html` (string, optional): HTML body
- `text` (string, optional): Text body

### `fastify.ses.sendRaw(options)`

Send emails with attachments using raw MIME format.

```js
await fastify.ses.sendRaw({
  rawMessage: `From: sender@example.com
To: user@example.com
Subject: With attachment
MIME-Version: 1.0
Content-Type: text/plain

Message body`
})
```

**Options:**
- `rawMessage` (string | Buffer): Raw MIME message

### `fastify.ses.sendBulk(options)`

Send personalized templated emails to multiple recipients.

```js
await fastify.ses.sendBulk({
  to: ['user1@example.com', 'user2@example.com'],
  template: 'WelcomeEmail',
  defaultTemplateData: { company: 'Acme' },
  bulkTemplateData: [
    { name: 'Alice' },
    { name: 'Bob' }
  ]
})
```

**Options:**
- `from` (string, optional): Sender email
- `to` (string[]): Array of recipients
- `template` (string): SES template name
- `defaultTemplateData` (object, optional): Default variables
- `bulkTemplateData` (array, optional): Per-recipient variables

**Note:** Create templates in AWS SES Console or via CLI first.

## Method Comparison

| Method | Use For | Key Feature |
|--------|---------|-------------|
| `send` | Normal emails | HTML/text to one or more |
| `sendRaw` | Attachments | Files, PDFs, images |
| `sendBulk` | Mass mailing | Personalized templates |

## Example

See [`examples/example.js`](./examples/example.js).

## Testing

```bash
npm test
```

## Requirements

- Node.js 18+
- Fastify v5
- AWS SES verified sender

## License

MIT © Karan Hotwani

## Repository

https://github.com/KaranHotwani/fastify-ses-mailer
