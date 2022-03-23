import { Control } from 'ol/control'
import TileLayer from 'ol/layer/Tile'
import { get } from 'ol/proj'
import XYZ from 'ol/source/XYZ'

import amapUtil from './amap'

export default class TrafficControl extends Control {
  constructor(opt_options) {
    const _options = opt_options || {}

    const _root = document.createElement('div')
    _root.className = 'control-traffic ol-unselectable ol-control'

    const _box = document.createElement('button')
    _box.innerHTML = 'T'

    _root.appendChild(_box)

    super({
      element: _root,
      target: _options.target,
    })

    if (_options.key) {
      this.set('key', _options.key)
    }

    this.loadTraffic = false
    this.interv = null

    this.duration_ =
      !isNaN(_options.duration) && _options.duration > 0
        ? _options.duration
        : 1000 * 60
    this.autoLoad_ = _options.autoLoad !== undefined ? _options.autoLoad : false

    if (this.autoLoad_) {
      this.addTrafficLayer()
    }

    _box.addEventListener('click', this.handleClick.bind(this), false)
  }

  handleClick() {
    event.preventDefault()
    if (!this.loadTraffic) {
      this.addTrafficLayer()
    } else {
      this.delTrafficLayer()
    }
  }

  addTrafficLayer() {
    let layer = this.getMap()
      .getLayers()
      .getArray()
      .find((p) => p.getProperties().key === 'amap-traffic')
    if (!layer) {
      this.getMap().addLayer(this.getTrafficLayer())
      this.element.className =
        'control-traffic ol-unselectable control-traffic-select ol-control'
      this.loadTraffic = true
      layer = this.getMap()
        .getLayers()
        .getArray()
        .find((p) => p.getProperties().key === 'amap-traffic')
      if (!this.interv) {
        this.interv = setInterval(() => {
          layer.getSource().clear()
          layer.setSource(
            new XYZ({
              // url: `https://tm.amap.com/trafficengine/mapabc/traffictile??v=1.0&;t=1&x={x}&y={y}&z={z}&&t=${amapUtil.longTime}`,
              tileUrlFunction: (tileCoord) => {
                let _zoom = parseInt(this.getMap().getView().getZoom(), 10)
                if (_zoom < 8 || _zoom > 18) return
                let [z, x, y] = tileCoord
                return `https://tm.amap.com/trafficengine/mapabc/traffictile??v=1.0&;t=1&x=${x}&y=${y}&z=${z}&&t=${amapUtil.longTime}`
              },
              projection: get('GCJ-02'),
              minZoom: 7,
              maxZoom: 18,
            })
          )
        }, this.duration_)
      }
    }
  }

  delTrafficLayer() {
    let layer = this.getMap()
      .getLayers()
      .getArray()
      .find((p) => p.getProperties().key === 'amap-traffic')
    if (layer) {
      this.getMap().removeLayer(layer)
      this.element.className = 'control-traffic ol-control'
      this.loadTraffic = false
      if (this.interv) {
        clearInterval(this.interv)
        this.interv = null
      }
    }
  }

  getTrafficLayer() {
    return new TileLayer({
      key: 'amap-traffic',
      source: new XYZ({
        // url: `https://tm.amap.com/trafficengine/mapabc/traffictile??v=1.0&;t=1&x={x}&y={y}&z={z}&&t=${amapUtil.longTime}`,
        tileUrlFunction: (tileCoord) => {
          let _zoom = parseInt(this.getMap().getView().getZoom(), 10)
          if (_zoom < 8 || _zoom > 18) return
          let [z, x, y] = tileCoord
          return `https://tm.amap.com/trafficengine/mapabc/traffictile??v=1.0&;t=1&x=${x}&y=${y}&z=${z}&&t=${amapUtil.longTime}`
        },
        // projection: get('EPSG:3857'),
        projection: get('GCJ-02'),
        minZoom: 7,
        maxZoom: 18,
      }),
      zIndex: 1,
    })
  }
}
