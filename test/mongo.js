var mongo = require('..').mongo;

describe('mongo.lonlat', function() {
  it('should convert string to coordinates array', function() {
    mongo.lonlat('12,13.4').should.eql([12, 13.4]);
    mongo.lonlat('-50.1,-10.4').should.eql([-50.1, -10.4]);
  });
});

describe('mongo.box', function() {
  it('should convert string to coordinates array', function() {
    mongo.box('-50.1,-10.4', '12,13.4').should.eql([[-50.1, -10.4], [12, 13.4]]);
  });
  it('should revert points order when needed', function() {
    mongo.box('12,13.4', '-50.1,-10.4').should.eql([[-50.1, -10.4], [12, 13.4]]);
  });
});

describe('mongo.poly', function() {
  it('should convert string to coordinates array', function() {
    mongo.poly('12,13.4,-50.1,-10.4,31,52,11.2,22.3').should.eql([
      [12, 13.4],
      [-50.1, -10.4],
      [31, 52],
      [11.2,22.3]
    ]);
    mongo.poly('12,13.4,-50.1,-10.4,31,52,11.2,22.3,0').should.eql([
      [12, 13.4],
      [-50.1, -10.4],
      [31, 52],
      [11.2,22.3]
    ]);
  });
});

describe('mongo.boxes', function() {
  it('should convert string to array of pairs', function() {
    mongo.boxes('12,13.4,-50.1,-10.4,31,52,11.2,22.3').should.eql([
      [
        [-50.1, -10.4],
        [12, 13.4]
      ],[
        [11.2,22.3],
        [31, 52]
      ]
    ]);
    mongo.boxes('12,13.4,-50.1,-10.4,31,52,11.2,22.3,0,1,2,3,4,5').should.eql([
      [
        [-50.1, -10.4],
        [12, 13.4]
      ],[
        [11.2,22.3],
        [31, 52]
      ],
      [
        [0, 1],
        [2, 3]
      ]
    ]);
  });
});
