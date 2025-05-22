const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { util } = require('..');

describe('parseAllFloats', () => {
  it('should convert string to array of floats', () => {
    assert.deepEqual(
      util.parseAllFloats('12,13.4,-50.1,-10.4,31,52,11.2,22.3'),
      [12, 13.4, -50.1, -10.4, 31, 52, 11.2, 22.3]
    );
  });

  it('should keep array of floats unchanged', () => {
    assert.deepEqual(util.parseAllFloats([2, 3, 4]), [2, 3, 4]);
  });
});
