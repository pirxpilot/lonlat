[![NPM version][npm-image]][npm-url]
[![Build Status][build-image]][build-url]
[![Dependency Status][deps-image]][deps-url]

# lonlat

Converters for various coordinate representations.

## Install

```sh
$ npm install --save lonlat
```

## Usage

```js
var lonlat = require('lonlat');

lonlat.geojson.centerSphere();
lonlat.mongo.toPoly();
```

### `geojson` methods always return geojson shape or collection of shapes

- `centerSphere`- create a Sphere corresponding to inscribed circle
- `multiPolygon` - create a Polygon from the string of coordinates
- `polygon` - create a Polygon from the string of coordinates
- `shapesArray` - split boxes into Polygons and Multipolygons
- `splitBox` - split box into grid of Polygons


### `mongo` methods return coordinates pairs [lon,lat] that can be indexed by mongo

- `toLonLat`
- `toPoly`
- `toBox`
- `toBoxes`

## License

MIT © [Damian Krzeminski](https://pirxpilot.me)

[npm-image]: https://img.shields.io/npm/v/lonlat
[npm-url]: https://npmjs.org/package/lonlat

[build-url]: https://github.com/pirxpilot/lonlat/actions/workflows/check.yaml
[build-image]: https://img.shields.io/github/actions/workflow/status/pirxpilot/lonlat/check.yaml?branch=main

[deps-image]: https://img.shields.io/librariesio/release/npm/lonlat
[deps-url]: https://libraries.io/npm/lonlat
