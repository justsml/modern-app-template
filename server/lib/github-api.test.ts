/** @jest-environment setup-polly-jest/jest-environment-node */
import path from 'path';

import { Polly } from '@pollyjs/core';
import NodeHttpAdapter from '@pollyjs/adapter-node-http';
import FetchAdapter from '@pollyjs/adapter-fetch';
import FSPersister from '@pollyjs/persister-fs';
import {setupPolly} from 'setup-polly-jest';

import { getUser, getRepo } from './github-api';

Polly.register(FetchAdapter);
Polly.register(NodeHttpAdapter);
Polly.register(FSPersister);

const pollyMode = process.env.POLLY_RECORD ? 'record' : 'replay';

describe('github-api', function () {
  const context = setupPolly({
    adapters: ['node-http'],
    logging: false,
    mode: pollyMode,
    expiresIn: '10d',
    // expiryStrategy: 'error',
    recordIfMissing: true,
    recordFailedRequests: true,
    persister: 'fs',
    persisterOptions: {
      fs: {
        recordingsDir: path.resolve(__dirname, '../__recordings__')
      }
    }
  });
  
  it('getUser', async function () {
    const user = await getUser('justsml');
    expect(typeof user).toBe('object');
    expect(user?.login).toBe('justsml');
  });

  it('getRepo', async function () {
    const repo = await getRepo('justsml', 'dans-blog');
    expect(typeof repo).toBe('object');
    expect((repo as any)?.name).toBe('dans-blog');
    expect((repo as any)?.owner?.login).toBe('justsml');
  });

  afterAll((): void => {
    context.polly.flush();
  })
});
