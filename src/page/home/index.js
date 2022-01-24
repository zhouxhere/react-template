import { Button } from 'antd'
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

  return (
    <div>
      <h3>home page</h3>
      <Button onClick={addCount}>add</Button>
      <Button onClick={delCount}>del</Button>
    </div>
  )
}

export default Home
