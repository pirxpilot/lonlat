var _ = require('lodash');

module.exports = {
  centerSphere: centerSphere,
  multiPolygon: multiPolygon,
  polygon: polygon,
  shapesArray: shapesArray,
  splitBox: splitBox
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


/**
 * Converts box into array of geojson shapes
 * swne - [sw,ne] - where sw, ne are both specified as [lon,lat]
 * metric.x, metrix.y - we'll split coordinates into at most x boxed horiontally and y boxes vertically
 * metric.delta - suggested minimal size of the resulting shape - if `delta` is specifies `x` and `y` are computed
 *
 * returns array of geojson Polygons which completely cover the area specified by swne
 */
function splitBox(swne, metric) {
  var x, y, delta, current, boxes = [];

  metric = _.defaults(metric || {}, {
    x: 4,
    y: 4
  });
  current = {
    x: swne[0][0],
    y: swne[0][1]
  };
  delta = {
    x: swne[1][0] - swne[0][0],
    y: swne[1][1] - swne[0][1]
  };

  if (metric.delta) {
    metric.x = Math.min(metric.x, Math.ceil(delta.x / metric.delta));
    metric.y = Math.min(metric.y, Math.ceil(delta.y / metric.delta));
  }

  delta.x /= metric.x;
  delta.y /= metric.y;

  for(x = 0; x < metric.x; x++) {
    current.y = swne[0][1];
    for(y = 0; y < metric.y; y++) {
      boxes.push([
        current.x,
        current.y,
        current.x + delta.x,
        current.y + delta.y
      ]);
      current.y += delta.y;
    }
    current.x += delta.x;
  }

  return boxes.map(function(box) {
    return {
      type: 'Polygon',
      coordinates: box2polygon(box)
    };
  });
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
