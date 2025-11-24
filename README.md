# fastify-ses-mailer

[![npm version](https://img.shields.io/npm/v/fastify-ses-mailer.svg)](https://www.npmjs.com/package/fastify-ses-mailer)
[![License](https://img.shields.io/npm/l/fastify-ses-mailer.svg)](https://github.com/KaranHotwani/fastify-ses-mailer/blob/main/LICENSE)
[![Node.js](https://img.shields.io/node/v/fastify-ses-mailer.svg)](https://nodejs.org/)

Fastify plugin for sending emails via AWS SES using AWS SDK v3.

## Why?

Sending emails with AWS SES in Fastify requires boilerplate setup - importing the SDK, configuring clients, handling credentials, and managing multiple send methods. This plugin simplifies it by:

- **Zero boilerplate** - One-line plugin registration
- **AWS SDK v3** - Modern, tree-shakeable, smaller bundle size
- **Automatic credentials** - Uses AWS credential chain (env vars, IAM roles, SSO)
- **Three methods** - Simple send, raw MIME (attachments), bulk templated emails
- **TypeScript support** - Full type definitions included
- **Production ready** - Validated inputs, tested, linted


## Installation

```bash
npm install fastify-ses-mailer
```

**Peer dependency:** Requires Fastify v5

## Usage

```js
import Fastify from 'fastify'
import fastifySES from 'fastify-ses-mailer'

const fastify = Fastify()

await fastify.register(fastifySES, {
  region: 'us-east-1',
  defaultFrom: 'sender@example.com'
})

// Send email
const result = await fastify.ses.send({
  to: 'user@example.com',
  subject: 'Hello',
  html: '<h1>Hi!</h1>',
  text: 'Hi!'
})

console.log('Message ID:', result.MessageId)
```

**Options:**
- `from` (string, optional): Sender email
- `to` (string | string[]): Recipient(s)
- `subject` (string): Email subject
- `html` (string, optional): HTML body
- `text` (string, optional): Text body

For `sendRaw()` (attachments) and `sendBulk()` (templated bulk emails), see [`examples/example.js`](./examples/example.js).

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `region` | `string` | `process.env.AWS_REGION` or `'us-east-1'` | AWS region |
| `defaultFrom` | `string` | `process.env.SES_FROM_EMAIL` | Default sender email |

## AWS Credentials

Set environment variables:

```bash
export AWS_REGION=us-east-1
export AWS_ACCESS_KEY_ID=your_key
export AWS_SECRET_ACCESS_KEY=your_secret
export SES_FROM_EMAIL=sender@example.com
```

Or use IAM roles, `~/.aws/credentials`, or AWS SSO.

## Example

See [`examples/example.js`](./examples/example.js) for a complete working example.

```bash
npm run example
```

## Testing

```bash
npm test
```

Tests verify plugin registration, parameter validation, and error handling. All tests run without making actual AWS API calls.

## Requirements

- Node.js 18+
- Fastify v5
- AWS SES verified sender

## License

MIT © [Karan Hotwani](https://github.com/KaranHotwani)

## Links

- **npm:** https://www.npmjs.com/package/fastify-ses-mailer
- **GitHub:** https://github.com/KaranHotwani/fastify-ses-mailer
