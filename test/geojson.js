var geojson = require('..').geojson;

describe('geojson.centerSphere', function() {
  it('should convert string to GeoJSON polygon', function() {
    geojson.centerSphere('12,13.4', 1000).should.eql({
      $centerSphere: [[12, 13.4], 0.0001567855942887398]
    });
    geojson.centerSphere('-50.1,-10.4', 5000).should.eql({
      $centerSphere: [[-50.1, -10.4], 0.000783927971443699]
    });
  });
});

describe('geojson.polygon', function() {
  it('should convert string to coordinates array', function() {
    geojson.polygon('4,6,0,3').should.eql({
      type: 'Polygon',
      coordinates: [
      [
        [4, 6],
        [0, 6],
        [0, 3],
        [4, 3],
        [4, 6],
      ]
    ]});
  });
});

describe('geojson.multiPolygon', function() {
  it('should convert box string to MultiPolygon', function() {
    geojson.multiPolygon('12,13.4,-50.1,-10.4,31,52,11.2,22.3').should.eql({
      type: 'MultiPolygon',
      coordinates: [
        [
          [ [ 12, 13.4 ], [ -50.1, 13.4 ], [ -50.1, -10.4 ], [ 12, -10.4 ], [ 12, 13.4 ] ]
        ],
        [
          [ [ 31, 52 ], [ 11.2, 52 ], [ 11.2, 22.3 ], [ 31, 22.3 ], [ 31, 52 ] ]
        ]
      ]
    });
  });
});


function createBoxString(n) {
  var i, r = '';
  for(i = 0; i < n; i++) {
    r += '0,0,1,1,';
  }
  return r.slice(0, -1);
}

describe('geojson.shapesArray', function() {

  it('creates a single Polygon when a single box is passed', function() {
    var result = geojson.shapesArray('0,0,1,1', 10);
    result.should.have.length(1);
    result[0].should.eql({
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

  it('creates Polygons only when suggestedLen is big', function() {
    var boxes = createBoxString(3);
    var result = geojson.shapesArray(boxes, 10);
    result.should.have.length(3);
    result.forEach(function(r) {
      r.should.eql({
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

  it('creates MultiPolygons and Polygons when suggestedLen is smaller then boxes', function() {
    var boxes = createBoxString(21);
    var result = geojson.shapesArray(boxes, 5);
    result.should.have.length(6);
    result.slice(0, 5).forEach(function(r) {
      r.should.have.property('type', 'MultiPolygon');
      // 4 boxes in each polygon
      r.should.have.property('coordinates').with.length(4);
    });
    result[5].should.have.property('type', 'Polygon');
    result[5].should.have.property('coordinates', [
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

describe('geojson.splitBox', function() {
  it('should split box into 4x4 grid', function() {
    var boxes = geojson.splitBox([[-1,-2],[15,30]]);
    boxes.should.have.length(16);

    boxes.forEach(function(shape) {
      shape.should.have.property('type', 'Polygon');
      shape.should.have.property('coordinates').with.length(1);
    });

    boxes[0].coordinates[0].should.eql([
      [-1, -2],
      [3, -2],
      [3, 6],
      [-1, 6],
      [-1, -2],
    ]);

    boxes[15].coordinates[0].should.eql([
      [11, 22],
      [15, 22],
      [15, 30],
      [11, 30],
      [11, 22],
    ]);

  });

  it('should respect suggested size', function() {
    var boxes = geojson.splitBox([[-1,-2],[15,30]], { x:8, y:2 });
    boxes.should.have.length(16);

    boxes.forEach(function(shape) {
      shape.should.have.property('type', 'Polygon');
      shape.should.have.property('coordinates').with.length(1);
    });

    boxes[0].coordinates[0].should.eql([
      [-1, -2],
      [1, -2],
      [1, 14],
      [-1, 14],
      [-1, -2],
    ]);

    boxes[15].coordinates[0].should.eql([
      [13, 14],
      [15, 14],
      [15, 30],
      [13, 30],
      [13, 14],
    ]);

  });

  it('should calculate number of shapes based on suggested delta', function() {
    var boxes = geojson.splitBox([[-1,-2],[15,30]], { delta: 10 });
    boxes.should.have.length(8);

    boxes.forEach(function(shape) {
      shape.should.have.property('type', 'Polygon');
      shape.should.have.property('coordinates').with.length(1);
    });

    boxes[0].coordinates[0].should.eql([
      [-1, -2],
      [7, -2],
      [7, 6],
      [-1, 6],
      [-1, -2],
    ]);

  });


});
