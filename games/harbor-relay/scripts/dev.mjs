import { createServer } from 'node:http';
import worker from '../worker/index.js';
import { memoryBucket } from './memory-bucket.mjs';

const env = { BUCKET: memoryBucket() };
const origin = 'http://127.0.0.1:' + (process.env.PORT || 4173);
createServer(async (request, response) => {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  const body = ['POST', 'PUT', 'PATCH'].includes(request.method) ? Buffer.concat(chunks) : undefined;
  const result = await worker.fetch(new Request(origin + request.url, {
    method: request.method, headers: request.headers, body,
  }), env);
  response.writeHead(result.status, Object.fromEntries(result.headers));
  response.end(Buffer.from(await result.arrayBuffer()));
}).listen(Number(new URL(origin).port), '127.0.0.1', () => console.log(origin));
