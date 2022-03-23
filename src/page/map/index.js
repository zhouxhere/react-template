import React, { useEffect, useState } from 'react'

import style from './index.module.less'
import './map.less'

import 'ol/ol.css'
import { View, Map } from 'ol'
import { register } from 'ol/proj/proj4'
import proj4 from 'proj4'
import { get, Projection, toLonLat, transformExtent } from 'ol/proj'
import {
  Attribution,
  FullScreen,
  MousePosition,
  Rotate,
  ScaleLine,
  Zoom,
  ZoomSlider,
} from 'ol/control'
import { WMTSCapabilities } from 'ol/format'
import WMTS, { optionsFromCapabilities } from 'ol/source/WMTS'
import XYZ from 'ol/source/XYZ'
import { getWidth, getTopLeft } from 'ol/extent'
import WMTSTileGrid from 'ol/tilegrid/WMTS'
import TileLayer from 'ol/layer/Tile'

import AMapLoader from '@amap/amap-jsapi-loader'
import amapUtil from './amap'
import './gcj02Mector'
import gcj02 from 'util/gcj02'
import LoadingControl from './loadingControl'
import TrafficControl from './trafficControl'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Cluster from 'ol/source/Cluster'
import { GeoJSON } from 'ol/format'
import { Circle, Stroke, Style, Text, Fill } from 'ol/style'
// import { bbox } from 'ol/loadingstrategy'

const MapPage = () => {
  // eslint-disable-next-line no-unused-vars
  const [map, setMap] = useState(null)
  // const [layers, setLayers] = useState([])
  // const [markers, setMarkers] = useState([])

  useEffect(async () => {
    // await loadAMap()
    registerProj4490()
    renderMap()
    console.log((await getWfs()).getSource().getFeatures())
  }, [])

  // eslint-disable-next-line no-unused-vars
  const registerProj4490 = () => {
    proj4.defs('EPSG:4490', '+proj=longlat +ellps=GRS80 +no_defs')
    register(proj4)

    const proj4490 = new Projection({
      code: 'EPSG:4490',
      extent: [-180, -90, 180, 90],
      worldExtent: [-180, -90, 180, 90],
    })
    return proj4490
  }

  // eslint-disable-next-line no-unused-vars
  const loadAMap = async () => {
    await AMapLoader.load({
      key: 'your key',
      version: '2.0',
      AMapUI: {
        version: '1.1',
      },
    })
  }

  // eslint-disable-next-line no-unused-vars
  const renderMap = async () => {
    let _map = new Map({
      controls: [
        new Zoom({
          className: 'control-zoom ol-zoom',
        }),
        new FullScreen({
          // className: 'control-fullscreen ol-full-screen',
        }),
        new MousePosition({
          className: 'control-position ol-mouse-position',
          projection: 'EPSG:4490',
          coordinateFormat: function (coordinate) {
            //  原本经纬度
            // return format(coordinate, '{x}, {y}', 6)
            //  高德经纬度
            return gcj02.fromWGS84(coordinate, [])
          },
        }),
        new Rotate({
          className: 'control-rotate ol-rotate',
        }),
        new ScaleLine({
          className: 'control-scale ol-scale-line',
        }),
        new ZoomSlider({
          className: 'ol-zoomslider control-slider',
        }),
        new Attribution({
          className: 'control-attribution ol-attribution',
          collapsible: false,
          collapsed: false,
        }),
        new LoadingControl({ key: 'loading' }),
        new TrafficControl({ key: 'traffic' }),
      ],
      layers: [
        (await getTianditu())[0],
        (await getTianditu())[1],
        await getWfs(),
      ],
      view: new View({
        center: [0, 0],
        zoom: 3,
        minZoom: 1,
        maxZoom: 19,
        projection: get('EPSG:3857'),
        constrainResolution: true,
        smoothResolutionConstraint: true,
        extent: transformExtent(
          [73.62, 16.7, 134.77, 53.56],
          'EPSG:4490',
          'EPSG:3857'
        ),
        // extent: [73.62, 16.7, 134.77, 53.56],
        showFullExtent: true,
      }),
      target: 'map',
    })
    setMap(_map)

    let traffic = _map
      .getLayers()
      .getArray()
      .find((p) => p.getProperties().key === 'amap-traffic')
    if (traffic) {
      setInterval(() => {
        traffic.getSource().clear()
        traffic.setSource(
          new XYZ({
            url: `https://tm.amap.com/trafficengine/mapabc/traffictile??v=1.0&;t=1&x={x}&y={y}&z={z}&&t=${amapUtil.longTime}`,
            projection: get('GCJ-02'),
            minZoom: 7,
            maxZoom: 20,
          })
        )
      }, 1000 * 60)
    }
    _map.on('singleclick', async (event) => {
      console.log(event)
      console.log(gcj02.fromWGS84(toLonLat(event.coordinate, 'EPSG:3857'), []))
    })
    _map.on('change:layergroup', (event) => {
      console.log(event)
    })

    let loading = _map
      .getControls()
      .getArray()
      .find((p) => p.getProperties().key === 'loading')
    if (loading) {
      loading.show()
      setTimeout(() => {
        loading.hide()
      }, 1000 * 3)
    }
  }

  // eslint-disable-next-line no-unused-vars
  const getTianditu = async () => {
    return Promise.all([
      fetch(
        `http://t${Math.floor(
          Math.random() * 7
        )}.tianditu.gov.cn/vec_w/wmts?request=GetCapabilities&service=wmts`
      ),
      fetch(
        `http://t${Math.floor(
          Math.random() * 7
        )}.tianditu.gov.cn/cva_w/wmts?request=GetCapabilities&service=wmts`
      ),
    ])
      .then((response) => {
        return Promise.all(response.map((item) => item.text()))
      })
      .then((text) => {
        let projection = get('EPSG:3857')
        let projectionExtent = projection.getExtent()
        let size = getWidth(projectionExtent) / 256
        let resolutions = new Array(19)
        let matrixIds = new Array(19)
        for (let z = 1; z < 19; ++z) {
          resolutions[z] = size / Math.pow(2, z)
          matrixIds[z] = z
        }

        return text.map((item, index) => {
          let result = new WMTSCapabilities().read(item)

          let option = optionsFromCapabilities(result, {
            layer: result.Contents.Layer[0].Identifier,
            matrixSet: result.Contents.TileMatrixSet[0].Identifier,
          })

          option.projection = projection
          option.tileGrid = new WMTSTileGrid({
            origin: getTopLeft(projectionExtent),
            resolutions: resolutions,
            matrixIds: matrixIds,
          })

          option.urls = option.urls.map((url) => url + 'tk=your token')

          let _url = option.urls[0]
          for (let i = 1; i < 8; i++) {
            option.urls.push(_url.replace('t0', `t${i}`))
          }

          return new TileLayer({
            key: `${result.Contents.Layer[0].Identifier}_${result.Contents.TileMatrixSet[0].Identifier}`,
            source: new WMTS({
              ...option,
              attributions: '&copy;your company',
            }),
            zIndex: index * 2,
          })
        })
      })
  }

  // eslint-disable-next-line no-unused-vars
  const getWfs = async () => {
    return await fetch(
      'https://gisserver.tianditu.gov.cn/TDTService/wfs?service=WFS&version=1.1.0&request=GetFeature&typename=TDTService:AGNP&outputFormat=application/json&srsname=EPSG:3857'
    )
      .then((response) => response.json())
      .then((res) => {
        // eslint-disable-next-line no-unused-vars
        let features = new GeoJSON().readFeatures(res)
        const styleCache = {}
        return new VectorLayer({
          source: new Cluster({
            source: new VectorSource({
              features: features,
            }),
          }),
          style: function (feature) {
            const size = feature.get('features').length
            let style = size === 1 ? null : styleCache[size]
            if (!style) {
              style = new Style({
                image: new Circle({
                  radius: 10,
                  stroke: new Stroke({
                    color: '#fff',
                  }),
                  fill: new Fill({
                    color: '#3399CC',
                  }),
                }),
                text: new Text({
                  text:
                    size === 1
                      ? feature.get('features')[0].getProperties().NAME
                      : size.toString(),
                  fill: new Fill({
                    color: '#fff',
                  }),
                }),
              })
              styleCache[size] = style
            }
            return style
          },
        })
      })
  }

  // eslint-disable-next-line no-unused-vars
  const getAMap = async () => {
    let AMap
    // eslint-disable-next-line no-undef
    if (AMap === undefined) {
      await AMapLoader.load({
        key: '2451a439b8ff9fce0c01fdfef55f1eb0',
        version: '2.0',
        AMapUI: {
          version: '1.1',
        },
      }).then((_map) => {
        AMap = _map
      })
    }
    return [
      new TileLayer({
        source: new XYZ({
          // eslint-disable-next-line no-undef
          url: new AMap.TileLayer()
            .getTileUrl()
            .replace(
              '{1,2,3,4}',
              (Math.floor(Math.random() * 4) + 1).toString()
            )
            .replace('[x]', '{x}')
            .replace('[y]', '{y}')
            .replace('[z]', '{z}'),
          projection: get('EPSG:3857'),
          minZoom: 3,
          maxZoom: 18,
        }),
        zIndex: 1,
      }),
      new TileLayer({
        source: new XYZ({
          // eslint-disable-next-line no-undef
          url: new AMap.TileLayer.RoadNet()
            .getTileUrl()
            .replace(
              '{1,2,3,4}',
              (Math.floor(Math.random() * 4) + 1).toString()
            )
            .replace('[x]', '{x}')
            .replace('[y]', '{y}')
            .replace('[z]', '{z}'),
          projection: 'EPSG:4490',
          crossOrigin: '*',
          minZoom: 7,
          maxZoom: 18,
        }),
        // zIndex: 1,
      }),
      new TileLayer({
        source: new XYZ({
          // eslint-disable-next-line no-undef
          url: new AMap.TileLayer.Satellite()
            .getTileUrl()
            .replace(
              '{1,2,3,4}',
              (Math.floor(Math.random() * 4) + 1).toString()
            )
            .replace('[x]', '{x}')
            .replace('[y]', '{y}')
            .replace('[z]', '{z}'),
          projection: 'EPSG:4490',
          crossOrigin: '*',
          minZoom: 3,
          maxZoom: 18,
        }),
        // zIndex: 1,
      }),
      new TileLayer({
        source: new XYZ({
          // eslint-disable-next-line no-undef
          url: new AMap.TileLayer.Traffic()
            .getTileUrl()
            .replace(
              '{1,2,3,4}',
              (Math.floor(Math.random() * 4) + 1).toString()
            )
            .replace('[x]', '{x}')
            .replace('[y]', '{y}')
            .replace('[z]', '{z}'),
          projection: 'EPSG:4490',
          crossOrigin: '*',
          minZoom: 7,
          maxZoom: 18,
        }),
        // zIndex: 1,
      }),
    ]
  }

  return (
    <div className={style['map']}>
      <div className={style['main']} id='map'></div>
    </div>
  )
}

export default MapPage
