import { ConfigProvider } from 'antd'
import React from 'react'
import Router from './router'
import zh_CN from 'antd/lib/locale/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'
import 'antd/dist/antd'

moment.locale('zh-cn')

const App = () => {
  return (
    <ConfigProvider locale={zh_CN}>
      <Router />
    </ConfigProvider>
  )
}

export default App
