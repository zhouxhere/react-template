import React, { useEffect } from 'react'
import Router from './router'
import { useSelector } from 'react-redux'
import { createTheme, ThemeProvider } from '@mui/material'

const App = () => {
  const themeConfig = useSelector((state) => state.theme)
  const theme = createTheme(themeConfig)

  useEffect(() => {
    console.log('app load')
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <Router />
    </ThemeProvider>
  )
}

export default App
