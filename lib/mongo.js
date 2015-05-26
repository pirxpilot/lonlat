module.exports = {
  lonlat: toLonLat,
  poly: toPoly,
  box: toBox,
  boxes: toBoxes
};


function toLonLat(ll) {
  return ll.split(',').map(parseFloat);
}

function fixBox(box) {
  return box[0][0] > box[1][0] ?
    [box[1], box[0]]:
    box;
}

function toBox(ne, sw) {
  return fixBox([toLonLat(sw), toLonLat(ne)]);
}

function toPairs(arr) {
  var result = [], item;
  arr.forEach(function(v) {
    if (!item) {
      item = [v];
    } else {
      item.push(v);
      result.push(fixBox(item));
      item = null;
    }
  });
  return result;
}

function toPoly(arr) {
  return toPairs(toLonLat(arr));
}

function toBoxes(arr) {
  return toPairs(toPoly(arr));
}
