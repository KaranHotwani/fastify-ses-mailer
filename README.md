# fastify-ses

A minimal, production-ready Fastify plugin for sending emails via AWS SES (Simple Email Service) using AWS SDK v3.

## Features

- 🚀 **Fastify v5** compatible
- ☁️ **AWS SDK v3** (`@aws-sdk/client-ses`)
- 🔐 Auto-picks AWS credentials from environment/IAM roles
- 📧 Three powerful methods: `send`, `sendRaw`, `sendBulk` (templated)
- 📦 ESM-only (modern Node.js)

## Installation

```bash
npm install fastify-ses
```

**Peer dependencies:**
```bash
npm install fastify@^5.0.0
```

## Usage

### Basic Setup

```js
import Fastify from 'fastify';
import fastifySES from 'fastify-ses';

const fastify = Fastify();

await fastify.register(fastifySES, {
  region: 'us-east-1',           // AWS region (default: AWS_REGION env var or 'us-east-1')
  defaultFrom: 'no-reply@example.com',  // Optional default sender (default: SES_FROM_EMAIL env var or null)
});

await fastify.listen({ port: 3000 });
```

### AWS Credentials

The plugin uses the AWS SDK v3's default credential provider chain. Credentials can be provided via:

- Environment variables (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `SES_FROM_EMAIL`)
- IAM roles (EC2, ECS, Lambda)
- Shared credentials file (`~/.aws/credentials`)
- AWS SSO

No need to pass credentials manually in code!

## API

### `fastify.ses.send(options)`

Send basic HTML or text emails.

**Options:**
- `from` (string): Sender email address (optional if `defaultFrom` is set)
- `to` (string | string[]): Recipient email address(es)
- `subject` (string): Email subject
- `html` (string, optional): HTML email body
- `text` (string, optional): Plain text email body

**Example:**

```js
const result = await fastify.ses.send({
  from: 'sender@example.com',
  to: 'recipient@example.com',
  subject: 'Hello World',
  html: '<h1>Welcome!</h1><p>This is a test email.</p>',
  text: 'Welcome! This is a test email.',
});

console.log('Message ID:', result.MessageId);
```

### `fastify.ses.sendRaw(options)`

Send emails with attachments. This method accepts a raw MIME-formatted message, which is required when you need to include file attachments (PDFs, images, etc.).

**Use case:** Sending invoices, receipts, reports, or any email with file attachments.

**Options:**
- `rawMessage` (string | Buffer): Raw MIME-formatted message

**Example:**

```js
const rawEmail = `From: sender@example.com
To: recipient@example.com
Subject: Test with attachment
MIME-Version: 1.0
Content-Type: text/plain; charset=UTF-8

This is a raw email message.`;

const result = await fastify.ses.sendRaw({
  rawMessage: rawEmail,
});
```

### `fastify.ses.sendBulk(options)`

Send personalized emails to multiple recipients efficiently (newsletters, promotional emails, welcome emails). Each recipient gets their own individual email with personalized content using AWS SES templates. Makes **one API call** instead of looping through recipients.

**Use case:** Mass mailing with personalization - each recipient gets a customized version (e.g., "Hi Alice, you have 20% off!" vs "Hi Bob, you have 15% off!").

**Note:** Requires an SES email template to be created in your AWS account first.

**Options:**
- `from` (string): Sender email address (optional if `defaultFrom` is set)
- `to` (string[]): Array of recipient email addresses
- `template` (string): Name of the SES email template
- `defaultTemplateData` (object, optional): Default template variables for all recipients
- `bulkTemplateData` (array of objects, optional): Per-recipient template variables (indexed by recipient order)

**Returns:** AWS SES bulk send response with status for each recipient

**Example:**

First, create a template in AWS SES (via AWS Console or CLI):
```json
{
  "TemplateName": "WelcomeEmail",
  "SubjectPart": "Welcome {{name}}!",
  "HtmlPart": "<h1>Hello {{name}}!</h1><p>Your account is ready.</p>",
  "TextPart": "Hello {{name}}! Your account is ready."
}
```

Then use it:
```js
const result = await fastify.ses.sendBulk({
  from: 'sender@example.com',
  to: ['user1@example.com', 'user2@example.com'],
  template: 'WelcomeEmail',
  defaultTemplateData: { company: 'Acme Corp' },
  bulkTemplateData: [
    { name: 'Alice', userId: '123' },
    { name: 'Bob', userId: '456' },
  ],
});

console.log(result.Status);
```

## Quick Method Comparison

| Method | Best For | Key Feature | API Calls |
|--------|----------|-------------|-----------|
| `send` | Normal emails | Simple HTML/text emails to one or more recipients | 1 per call |
| `sendRaw` | **Attachments** | Emails with files (PDFs, images, etc.) | 1 per call |
| `sendBulk` | **Mass mailing** | Personalized template emails to many people | 1 for all recipients |

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `region` | string | `process.env.AWS_REGION` or `'us-east-1'` | AWS region for SES |
| `defaultFrom` | string | `process.env.SES_FROM_EMAIL` or `null` | Default sender email address |

## Example: Route Handler

```js
fastify.post('/send-email', async (request, reply) => {
  const { to, subject, message } = request.body;

  try {
    const result = await fastify.ses.send({
      to,
      subject,
      html: `<p>${message}</p>`,
    });

    return { success: true, messageId: result.MessageId };
  } catch (error) {
    reply.code(500);
    return { success: false, error: error.message };
  }
});
```

## Requirements

- Node.js 18+ (ESM support)
- Fastify v5
- AWS SES access (verified sender email or domain)

## Example

Check out [`examples/example.js`](./examples/example.js) for a working example demonstrating all three methods.

**Run the example:**
```bash
npm install
npm run example
```

Make sure to set your AWS credentials first:
```bash
export AWS_REGION=us-east-1
export AWS_ACCESS_KEY_ID=your_key
export AWS_SECRET_ACCESS_KEY=your_secret
export SES_FROM_EMAIL=your-verified-email@example.com
```

Or create a `.env` file (dotenv is included in devDependencies).

## Testing

Run the test suite:
```bash
npm test
```

Tests verify:
- Plugin registration and decorators
- Parameter validation for all methods
- Error handling

All tests run without making actual AWS API calls.

## License

MIT © Karan Hotwani

## Repository

[https://github.com/karan-hotwani/fastify-ses](https://github.com/karan-hotwani/fastify-ses)

