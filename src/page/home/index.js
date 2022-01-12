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
      <button onClick={addCount}>add</button>
      <button onClick={delCount}>del</button>
    </div>
  )
}

export default Home
