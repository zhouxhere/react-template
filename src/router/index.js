import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import BasicLayout from '../layout/basic'
import Home from '../page/home'

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<BasicLayout />}>
          <Route element={<Home />} index />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Router
