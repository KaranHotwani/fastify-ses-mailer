import { FastifyPluginCallback } from 'fastify';
import { SendEmailCommandOutput, SendRawEmailCommandOutput, SendBulkTemplatedEmailCommandOutput } from '@aws-sdk/client-ses';
import { AwsCredentialIdentity, AwsCredentialIdentityProvider } from '@smithy/types';

declare module 'fastify' {
  interface FastifyInstance {
    ses: {
      send(options: SendEmailOptions): Promise<SendEmailCommandOutput>;
      sendRaw(options: SendRawEmailOptions): Promise<SendRawEmailCommandOutput>;
      sendBulk(options: SendBulkEmailOptions): Promise<SendBulkTemplatedEmailCommandOutput>;
    };
  }
}

export interface FastifySESOptions {
  region?: string;
  defaultFrom?: string;
  credentials?: AwsCredentialIdentity | AwsCredentialIdentityProvider;
  endpoint?: string;
  maxAttempts?: number;
  retryMode?: string;
}

export interface SendEmailOptions {
  from?: string;
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
}

export interface SendRawEmailOptions {
  rawMessage: string | Buffer;
}

export interface SendBulkEmailOptions {
  from?: string;
  to: string[];
  template: string;
  defaultTemplateData?: Record<string, any>;
  bulkTemplateData?: Record<string, any>[];
}

declare const fastifySES: FastifyPluginCallback<FastifySESOptions>;

export default fastifySES;

