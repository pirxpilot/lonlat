const { describe, it } = require('node:test');
const { util } = require('..');

describe('parseAllFloats', function () {
  it('should convert string to array of floats', function () {
    util.parseAllFloats('12,13.4,-50.1,-10.4,31,52,11.2,22.3').should.eql([
      12,
      13.4,
      -50.1,
      -10.4,
      31,
      52,
      11.2,
      22.3
    ]);
  });

  it('should keep array of floats unchanged', function () {
    util.parseAllFloats([2, 3, 4]).should.eql([2, 3, 4]);
  });

});
