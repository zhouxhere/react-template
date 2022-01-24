import React, { lazy, Suspense } from 'react'
import { useSelector } from 'react-redux'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Redirect from './redirect'
import { defaultRoutes } from './routes'
import { routerTool } from '../util/router'

const Router = () => {
  const appUrls = useSelector((state) => state.app.urls)
  const redirects = useSelector((state) => state.app.redirects)

  const processRoutes = (params) => {
    if (!params) return []
    let allRedirects = routerTool.processRoutes(defaultRoutes, redirects)
    let routes = params.map((item) => {
      let Component = lazy(() => import(`src/${item.component}`))
      let redirect = allRedirects.find((p) => p.from === item.code)
      let props = {
        element: (
          <Suspense fallback={<div>loading</div>}>
            <Redirect redirect={redirect ? redirect.toUrl : ''}>
              <Component />
            </Redirect>
          </Suspense>
        ),
        path: item.path,
      }
      return (
        <Route key={item.path} {...props}>
          {processRoutes(item.children)}
        </Route>
      )
    })
    return routes
  }

  return (
    <BrowserRouter>
      <Routes>
        {processRoutes(defaultRoutes)}
        <Route
          path='*'
          element={<Navigate to={appUrls?.defaultUrl || '/'} />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default Router
