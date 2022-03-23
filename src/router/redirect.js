/* eslint-disable react/prop-types */
import React, { useEffect } from 'react'
import { generatePath, useMatch, useNavigate } from 'react-router-dom'

const Redirect = (props) => {
  const match = useMatch(props.redirect)
  const isFrom = useMatch(props.from)
  const navigate = useNavigate()
  useEffect(() => {
    console.log(props)
    if (props.redirect && isFrom) {
      if (match) {
        navigate(generatePath(props.redirect, match.params))
      } else {
        navigate(props.redirect)
      }
    }
  }, [])
  return <>{props.children}</>
}

export default Redirect
