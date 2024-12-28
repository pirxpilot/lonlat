const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { geojson } = require('..');

describe('geojson.centerSphere', function () {
  it('should convert string to GeoJSON polygon', function () {
    assert.deepEqual(geojson.centerSphere('12,13.4', 1000), {
      $centerSphere: [
        [12, 13.4], 0.0001567855942887398
      ]
    });
    assert.deepEqual(geojson.centerSphere('-50.1,-10.4', 5000), {
      $centerSphere: [
        [-50.1, -10.4], 0.000783927971443699
      ]
    });
  });
});

describe('geojson.polygon', function () {
  it('should convert string to coordinates array', function () {
    assert.deepEqual(geojson.polygon('4,6,0,3'), {
      type: 'Polygon',
      coordinates: [
        [
          [4, 6],
          [0, 6],
          [0, 3],
          [4, 3],
          [4, 6],
        ]
      ]
    });
  });
});

describe('geojson.multiPolygon', function () {
  it('should convert box string to MultiPolygon', function () {
    assert.deepEqual(geojson.multiPolygon('12,13.4,-50.1,-10.4,31,52,11.2,22.3'), {
      type: 'MultiPolygon',
      coordinates: [
        [
          [
            [12, 13.4],
            [-50.1, 13.4],
            [-50.1, -10.4],
            [12, -10.4],
            [12, 13.4]
          ]
        ],
        [
          [
            [31, 52],
            [11.2, 52],
            [11.2, 22.3],
            [31, 22.3],
            [31, 52]
          ]
        ]
      ]
    });
  });
});


function createBoxString(n) {
  let i;
  let r = '';
  for (i = 0; i < n; i++) {
    r += '0,0,1,1,';
  }
  return r.slice(0, -1);
}

describe('geojson.shapesArray', function () {

  it('creates a single Polygon when a single box is passed', function () {
    const result = geojson.shapesArray('0,0,1,1', 10);
    assert.equal(result.length, 1);
    assert.deepEqual(result[0], {
      type: 'Polygon',
      coordinates: [
        [
          [0, 0],
          [1, 0],
          [1, 1],
          [0, 1],
          [0, 0]
        ]
      ]
    });
  });

  it('creates Polygons only when suggestedLen is big', function () {
    const boxes = createBoxString(3);
    const result = geojson.shapesArray(boxes, 10);
    assert.equal(result.length, 3);
    result.forEach(function (r) {
      assert.deepEqual(r, {
        type: 'Polygon',
        coordinates: [
          [
            [0, 0],
            [1, 0],
            [1, 1],
            [0, 1],
            [0, 0]
          ]
        ]
      });
    });
  });

  it('creates MultiPolygons and Polygons when suggestedLen is smaller then boxes', function () {
    const boxes = createBoxString(21);
    const result = geojson.shapesArray(boxes, 5);
    assert.equal(result.length, 6);
    result.slice(0, 5).forEach(function (r) {
      assert.equal(r.type, 'MultiPolygon');
      // 4 boxes in each polygon
      assert.equal(r.coordinates.length, 4);
    });
    assert.equal(result[5].type, 'Polygon');
    assert.deepEqual(result[5].coordinates, [
      [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
        [0, 0]
      ]
    ]);
  });
});

describe('geojson.splitBox', function () {
  it('should split box into 4x4 grid', function () {
    const boxes = geojson.splitBox([
      [-1, -2],
      [15, 30]
    ]);
    assert.equal(boxes.length, 16);

    boxes.forEach(function (shape) {
      assert.equal(shape.type, 'Polygon');
      assert.equal(shape.coordinates.length, 1);
    });

    assert.deepEqual(boxes[0].coordinates[0], [
      [-1, -2],
      [3, -2],
      [3, 6],
      [-1, 6],
      [-1, -2],
    ]);

    assert.deepEqual(boxes[15].coordinates[0], [
      [11, 22],
      [15, 22],
      [15, 30],
      [11, 30],
      [11, 22],
    ]);

  });

  it('should respect suggested size', function () {
    const boxes = geojson.splitBox([
      [-1, -2],
      [15, 30]
    ], { x: 8, y: 2 });
    assert.equal(boxes.length, 16);

    boxes.forEach(function (shape) {
      assert.equal(shape.type, 'Polygon');
      assert.equal(shape.coordinates.length, 1);
    });

    assert.deepEqual(boxes[0].coordinates[0], [
      [-1, -2],
      [1, -2],
      [1, 14],
      [-1, 14],
      [-1, -2],
    ]);

    assert.deepEqual(boxes[15].coordinates[0], [
      [13, 14],
      [15, 14],
      [15, 30],
      [13, 30],
      [13, 14],
    ]);

  });

  it('should calculate number of shapes based on suggested delta', function () {
    const boxes = geojson.splitBox([
      [-1, -2],
      [15, 30]
    ], { delta: 10 });
    assert.equal(boxes.length, 8);

    boxes.forEach(function (shape) {
      assert.equal(shape.type, 'Polygon');
      assert.equal(shape.coordinates.length, 1);
    });

    assert.deepEqual(boxes[0].coordinates[0], [
      [-1, -2],
      [7, -2],
      [7, 6],
      [-1, 6],
      [-1, -2],
    ]);

  });


});
