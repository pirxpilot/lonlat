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
