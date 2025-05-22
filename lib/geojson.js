const { parseAllFloats } = require('./util');

module.exports = {
  centerSphere,
  multiPolygon,
  polygon,
  shapesArray,
  splitBox
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
  const multipolygon = boxes2multipolygon(boxes);
  const bucketSize = Math.round(multipolygon.length / suggestedLen);
  if (bucketSize <= 1) {
    return multipolygon.map(chunk => ({
      type: 'Polygon',
      coordinates: chunk
    }));
  }
  return chunks(multipolygon, bucketSize).map(chunk =>
    chunk.length === 1
      ? {
          type: 'Polygon',
          coordinates: chunk[0]
        }
      : {
          type: 'MultiPolygon',
          coordinates: chunk
        }
  );

  function chunks(arr, size) {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  }
}

/**
 * Converts box into array of geojson shapes
 * swne - [sw,ne] - where sw, ne are both specified as [lon,lat]
 * metric.x, metrix.y - we'll split coordinates into at most x boxed horiontally and y boxes vertically
 * metric.delta - suggested minimal size of the resulting shape - if `delta` is specifies `x` and `y` are computed
 *
 * returns array of geojson Polygons which completely cover the area specified by swne
 */
function splitBox(swne, metric = {}) {
  const boxes = [];

  metric = {
    x: 4,
    y: 4,
    ...metric
  };
  const current = {
    x: swne[0][0],
    y: swne[0][1]
  };
  const delta = {
    x: swne[1][0] - swne[0][0],
    y: swne[1][1] - swne[0][1]
  };

  if (metric.delta) {
    metric.x = Math.min(metric.x, Math.ceil(delta.x / metric.delta));
    metric.y = Math.min(metric.y, Math.ceil(delta.y / metric.delta));
  }

  delta.x /= metric.x;
  delta.y /= metric.y;

  for (let x = 0; x < metric.x; x++) {
    current.y = swne[0][1];
    for (let y = 0; y < metric.y; y++) {
      boxes.push([current.x, current.y, current.x + delta.x, current.y + delta.y]);
      current.y += delta.y;
    }
    current.x += delta.x;
  }

  return boxes.map(box => ({
    type: 'Polygon',
    coordinates: box2polygon(box)
  }));
}

function centerSphere(ll, radius) {
  ll = parseAllFloats(ll);
  if (!ll) {
    return;
  }
  return {
    $centerSphere: [ll, meters2rad(radius)]
  };
}

function meters2rad(meters) {
  return meters / 6378137; // Earth radius
}

// from array of box coordinates to polygon
function box2polygon(arr, i = 0) {
  const x0 = arr[i];
  const y0 = arr[i + 1];
  const x1 = arr[i + 2];
  const y1 = arr[i + 3];
  return [
    [
      [x0, y0],
      [x1, y0],
      [x1, y1],
      [x0, y1],
      [x0, y0]
    ]
  ];
}

// from array of box coordinates to multi-polygon
function boxes2multipolygon(arr) {
  const multipolygon = [];
  for (let i = 0; i < arr.length; i += 4) {
    multipolygon.push(box2polygon(arr, i));
  }
  return multipolygon;
}
