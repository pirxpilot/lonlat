var _ = require('lodash');

module.exports = {
  centerSphere: centerSphere,
  multiPolygon: multiPolygon,
  polygon: polygon,
  shapesArray: shapesArray
};

function polygon(box) {
  box = parseAllFloats(box);
  if (!box) {
    return;
  }
  return {
    type: 'Polygon',
    coordinates: box2polygon(box)
  };
}

function multiPolygon(boxes) {
  boxes = parseAllFloats(boxes);
  if (!boxes) {
    return;
  }
  return {
    type: 'MultiPolygon',
    coordinates: boxes2multipolygon(boxes)
  };
}

// creates an array of polygons and multipolygons with at most suggestedLen items
function shapesArray(boxes, suggestedLen) {
  boxes = parseAllFloats(boxes);
  if (!boxes) {
    return;
  }
  var multipolygon = boxes2multipolygon(boxes);
  var bucketSize = Math.round(multipolygon.length / suggestedLen);
  if (bucketSize < 1) {
    bucketSize = 1;
  }
  return _(multipolygon)
    .chunk(bucketSize)
    .map(function(chunk) {
      if(chunk.length === 1) {
        return {
          type: 'Polygon',
          coordinates: chunk[0]
        };
      }
      return {
        type: 'MultiPolygon',
        coordinates: chunk
      };
    })
    .value();
}

function centerSphere(ll, radius) {
  ll = parseAllFloats(ll);
  if (!ll) {
    return;
  }
  return {
    $centerSphere: [ ll, meters2rad(radius) ]
  };
}

function meters2rad(meters) {
  return meters / 6378137; // Earth radius
}

function parseAllFloats(str) {
  if (!str) {
    return;
  }
  return str.split(',').map(parseFloat);
}

// from array of box coordinates to polygon
function box2polygon(arr, i) {
  i = i || 0;
  var
    x0 = arr[i],
    y0 = arr[i + 1],
    x1 = arr[i + 2],
    y1 = arr[i + 3];
  return [[
    [x0, y0],
    [x1, y0],
    [x1, y1],
    [x0, y1],
    [x0, y0]
  ]];
}

// from array of box coordinates to multi-polygon
function boxes2multipolygon(arr, i) {
  var multipolygon = [];
  for(i = 0; i < arr.length; i += 4) {
    multipolygon.push(box2polygon(arr, i));
  }
  return multipolygon;
}
