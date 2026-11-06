import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Script } from 'node:vm';
import worker, { advance, BOT, createRoom, HTML, start } from '../worker/index.js';
import { memoryBucket } from './memory-bucket.mjs';

test('browser code and downloadable sample bot parse', () => {
  new Script(HTML.match(/<script>([\s\S]*?)<\/script>/)[1]);
  new Script(`(async () => {${BOT}})`);
});

test('separate host and agent clients play a complete three-seat match with a server bot', async () => {
  const env = { BUCKET: memoryBucket() };
  async function request(path, body, token) {
    const response = await worker.fetch(new Request('https://test.invalid' + path, {
      method: body === undefined ? 'GET' : 'POST',
      headers: token ? { authorization: `Bearer ${token}` } : {},
      body: JSON.stringify(body),
    }), env);
    return { status: response.status, ...await response.json() };
  }
  assert.equal((await request('/api/rooms', { name: 'Fraction', seats: 2.5 })).status, 400);
  const host = await request('/api/rooms', { name: 'Human', seats: 3 });
  assert.equal(host.status, 201);
  const path = `/api/rooms/${host.room.code}`;
  const agent = await request(path + '/join', { name: 'External agent' });
  assert.equal(agent.status, 201);
  assert.equal((await request(path + '/start', {}, 'invalid')).status, 401);
  assert.equal((await request(path + '/start', {}, agent.token)).status, 400);
  let { room } = await request(path + '/start', {}, host.token);
  assert.equal(room.players.filter(p => p.bot).length, 1);
  assert.ok(room.players.every(p => !('token' in p)));
  assert.equal((await request(path + '/join', { name: 'Late' })).status, 400);
  const opening = { version: room.version, move: room.legalActions[0] };
  const race = await Promise.all([request(path + '/moves', opening, host.token), request(path + '/moves', opening, host.token)]);
  assert.deepEqual(race.map(r => r.status).sort(), [200, 409]);
  room = (await request(path)).room;
  for (let i = 0; room.status === 'playing' && i < 12; i++) {
    const result = await request(path + '/moves', { version: room.version, move: room.legalActions.at(-1) }, [host.token, agent.token][room.turn]);
    assert.equal(result.status, 200, result.error);
    room = result.room;
  }
  assert.equal(room.status, 'finished');
  assert.equal(room.finishReason, 'six_rounds_complete');
  assert.equal(room.log.length, 18);
  assert.equal(room.log.filter(entry => entry.automatic).length, 6);
  assert.ok(room.winners.length >= 1);
  assert.ok(room.players.every(p => p.fuel >= 0 && p.fuel <= 8));
});

test('timeouts and seven-minute deadline, including a full four-seat room', () => {
  const game = createRoom('TEST000', 'Host', 4, 0);
  start(game, 0);
  assert.equal(game.players.length, 4);
  assert.equal(advance(game, 34999), false);
  assert.equal(advance(game, 35000), true);
  assert.equal(game.log.length, 7);
  assert.ok(game.log.every(entry => entry.automatic));
  assert.equal(advance(game, 420000), true);
  assert.equal(game.finishReason, 'seven_minute_limit');
});
