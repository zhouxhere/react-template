import { Button } from '@mui/material'
import { orange } from '@mui/material/colors'
import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'

const Home = () => {
  const dispatch = useDispatch()

  const addCount = useCallback(() => {
    dispatch({ type: 'ADD_COUNT' })
  }, [dispatch])

  const delCount = useCallback(() => {
    dispatch({ type: 'DEL_COUNT' })
  }, [dispatch])

  const changeTheme = useCallback(() => {
    dispatch({
      type: 'THEME_UPDATE',
      palette: {
        primary: {
          main: orange[500],
        },
      },
    })
  }, [dispatch])

  const resetTheme = useCallback(() => {
    dispatch({
      type: 'THEME_RESET',
    })
  }, [dispatch])

  return (
    <div>
      <h3>home page</h3>
      <Button variant='outlined' onClick={addCount}>
        add
      </Button>
      <Button variant='outlined' onClick={delCount}>
        del
      </Button>
      <Button variant='outlined' onClick={changeTheme}>
        change
      </Button>
      <Button variant='outlined' onClick={resetTheme}>
        reset
      </Button>
    </div>
  )
}
export default Home
