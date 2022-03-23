import { Control } from 'ol/control'

export default class LoadingControl extends Control {
  constructor(opt_options) {
    const _options = opt_options || {}

    const _root = document.createElement('div')
    _root.className = 'ol-layer-data-loading'
    _root.style = {
      width: '100%',
      height: '100%',
      'background-color': 'rgba(255,255,255,0.5)',
    }

    const _box = document.createElement('span')
    _box.className = 'ol-layer-spin-dot-spin'

    for (let i = 0; i < 4; i++) {
      const _i = document.createElement('i')
      _i.className = 'ol-layer-spin-dot-item dot' + i
      _box.appendChild(_i)
    }
    _root.appendChild(_box)

    super({
      element: _root,
      target: _options.target,
    })

    if (_options.key) {
      this.set('key', _options.key)
    }
  }

  show = function () {
    this.element.style.display = 'block'
  }

  hide = function () {
    this.element.style.display = 'none'
  }
}
