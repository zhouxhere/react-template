import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'

const BasicLayout = () => {
  const count = useSelector((state) => state.count)

  return (
    <div>
      <h2>basic layout</h2>
      <p>count:{count}</p>
      <Outlet />
    </div>
  )
}

export default BasicLayout
