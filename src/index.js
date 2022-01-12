import 'core-js'
import 'regenerator-runtime'

import React from 'react'
import ReactDOM from 'react-dom'
import Router from './router'
import { Provider } from 'react-redux'
import store from './store'

const element = (
  <Provider store={store}>
    <Router />
  </Provider>
)

ReactDOM.render(element, document.getElementById('root'))
