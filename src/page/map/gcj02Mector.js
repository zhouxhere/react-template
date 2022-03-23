// 导入proj控件,使用其方法注入gcj02坐标系
import * as proj from 'ol/proj'
import gcj02 from 'util/gcj02'

var forEachPoint = function (func) {
  return function (input, opt_output, opt_dimension) {
    var len = input.length
    var dimension = opt_dimension ? opt_dimension : 2
    var output
    if (opt_output) {
      output = opt_output
    } else {
      if (dimension !== 2) {
        output = input.slice()
      } else {
        output = new Array(len)
      }
    }
    for (var offset = 0; offset < len; offset += dimension) {
      func(input, output, offset)
    }
    return output
  }
}

var sphericalMercator = {}

var RADIUS = 6378137
var MAX_LATITUDE = 85.0511287798
var RAD_PER_DEG = Math.PI / 180

sphericalMercator.forward = forEachPoint(function (input, output, offset) {
  var lat = Math.max(Math.min(MAX_LATITUDE, input[offset + 1]), -MAX_LATITUDE)
  var sin = Math.sin(lat * RAD_PER_DEG)

  output[offset] = RADIUS * input[offset] * RAD_PER_DEG
  output[offset + 1] = (RADIUS * Math.log((1 + sin) / (1 - sin))) / 2
})

sphericalMercator.inverse = forEachPoint(function (input, output, offset) {
  output[offset] = input[offset] / RADIUS / RAD_PER_DEG
  output[offset + 1] =
    (2 * Math.atan(Math.exp(input[offset + 1] / RADIUS)) - Math.PI / 2) /
    RAD_PER_DEG
})

var projzh = {}
projzh.ll2gmerc = function (input, opt_output, opt_dimension) {
  let output = gcj02.fromWGS84(input, opt_output, opt_dimension)
  return projzh.ll2smerc(output, output, opt_dimension)
}
projzh.gmerc2ll = function (input, opt_output, opt_dimension) {
  let output = projzh.smerc2ll(input, input, opt_dimension)
  return gcj02.toWGS84(output, opt_output, opt_dimension)
}
projzh.smerc2gmerc = function (input, opt_output, opt_dimension) {
  let output = projzh.smerc2ll(input, input, opt_dimension)
  output = gcj02.fromWGS84(output, output, opt_dimension)
  return projzh.ll2smerc(output, output, opt_dimension)
}
projzh.gmerc2smerc = function (input, opt_output, opt_dimension) {
  let output = projzh.smerc2ll(input, input, opt_dimension)
  output = gcj02.toWGS84(output, output, opt_dimension)
  return projzh.ll2smerc(output, output, opt_dimension)
}

projzh.ll2smerc = sphericalMercator.forward
projzh.smerc2ll = sphericalMercator.inverse

// 定义GCJ02
const gcj02Extent = [
  -20037508.342789244, -20037508.342789244, 20037508.342789244,
  20037508.342789244,
]
const gcj02Mecator = new proj.Projection({
  code: 'GCJ-02',
  extent: gcj02Extent,
  units: 'm',
})
proj.addProjection(gcj02Mecator)
// 将4326/3857转为gcj02坐标的方法定义
proj.addCoordinateTransforms(
  'EPSG:4326',
  gcj02Mecator,
  projzh.ll2gmerc,
  projzh.gmerc2ll
)
proj.addCoordinateTransforms(
  'EPSG:3857',
  gcj02Mecator,
  projzh.smerc2gmerc,
  projzh.gmerc2smerc
)

export default { gcj02Mecator, gcj02 }
// 我使用的react，所以这里需要导出定义的gcj02Mecator，提供给外部使用
// export default gcj02Mecator
