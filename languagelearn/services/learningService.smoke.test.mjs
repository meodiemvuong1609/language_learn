import { test } from 'node:test';
import assert from 'node:assert/strict';

function results(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  return data.results || [];
}

test('unwrap paginated results', () => {
  assert.deepEqual(results({ results: [{ id: 1 }] }), [{ id: 1 }]);
  assert.deepEqual(results([{ id: 2 }]), [{ id: 2 }]);
});
