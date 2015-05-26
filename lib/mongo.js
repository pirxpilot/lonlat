module.exports = {
  lonlat: toLonLat,
  poly: toPoly,
  box: toBox,
  boxes: toBoxes
};


function toLonLat(ll) {
  return ll.split(',').map(parseFloat);
}

function fixBox(box, index) {
  index = index || 0;
  return box[index][0] > box[index + 1][0] ?
    [box[index + 1], box[index]]:
    [box[index], box[index + 1]];
}

function toBox(ne, sw) {
  return fixBox([toLonLat(sw), toLonLat(ne)]);
}

function toPairs(arr) {
  var result = [], i;
  for(i = 0; i < arr.length - 1; i += 2) {
      result.push(fixBox(arr, i));
  }
  return result;
}

function toPoly(arr) {
  return toPairs(toLonLat(arr));
}

function toBoxes(arr) {
  return toPairs(toPoly(arr));
}
