import { test } from 'node:test';
import assert from 'node:assert/strict';

function unwrap(data) {
  if (data && typeof data.code === 'number') {
    if (data.code === 200) return data.data;
    throw new Error(data.message || 'Request failed');
  }
  return data;
}

test('unwrap auth payload', () => {
  assert.equal(unwrap({ code: 200, data: 'tok' }), 'tok');
});

test('unwrap passthrough list', () => {
  const payload = { count: 1, results: [1] };
  assert.deepEqual(unwrap(payload), payload);
});
