import 'core-js'
import 'regenerator-runtime'

import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Provider } from 'react-redux'
import store from './store'

import './asset/style/global.less'

const element = (
  <Provider store={store}>
    <App />
  </Provider>
)

ReactDOM.render(element, document.getElementById('root'))
