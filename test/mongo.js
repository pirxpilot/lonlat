const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { mongo } = require('..');

describe('mongo.lonlat', () => {
  it('should convert string to coordinates array', () => {
    assert.deepEqual(mongo.lonlat('12,13.4'), [12, 13.4]);
    assert.deepEqual(mongo.lonlat('-50.1,-10.4'), [-50.1, -10.4]);
  });
});

describe('mongo.box', () => {
  it('should convert string to coordinates array', () => {
    assert.deepEqual(mongo.box('-50.1,-10.4', '12,13.4'), [
      [-50.1, -10.4],
      [12, 13.4]
    ]);
  });
  it('should revert points order when needed', () => {
    assert.deepEqual(mongo.box('12,13.4', '-50.1,-10.4'), [
      [-50.1, -10.4],
      [12, 13.4]
    ]);
  });
});

describe('mongo.poly', () => {
  it('should convert string to coordinates array', () => {
    assert.deepEqual(mongo.poly('12,13.4,-50.1,-10.4,31,52,11.2,22.3'), [
      [12, 13.4],
      [-50.1, -10.4],
      [31, 52],
      [11.2, 22.3]
    ]);
    assert.deepEqual(mongo.poly('12,13.4,-50.1,-10.4,31,52,11.2,22.3,0'), [
      [12, 13.4],
      [-50.1, -10.4],
      [31, 52],
      [11.2, 22.3]
    ]);
  });
});

describe('mongo.boxes', () => {
  it('should convert string to array of pairs', () => {
    assert.deepEqual(mongo.boxes('12,13.4,-50.1,-10.4,31,52,11.2,22.3'), [
      [
        [-50.1, -10.4],
        [12, 13.4]
      ],
      [
        [11.2, 22.3],
        [31, 52]
      ]
    ]);
    assert.deepEqual(mongo.boxes('12,13.4,-50.1,-10.4,31,52,11.2,22.3,0,1,2,3,4,5'), [
      [
        [-50.1, -10.4],
        [12, 13.4]
      ],
      [
        [11.2, 22.3],
        [31, 52]
      ],
      [
        [0, 1],
        [2, 3]
      ]
    ]);
  });
});
