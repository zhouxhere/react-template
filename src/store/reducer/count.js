import { storeTool } from '../../util/store'

const addCount = (state) => {
  return state + 1
}

const setCount = (state, param) => {
  return param
}

const delCount = (state) => {
  return state <= 0 ? 0 : state - 1
}

const countReducer = storeTool.createReducer(0, {
  ADD_COUNT: addCount,
  SET_COUNT: setCount,
  DEL_COUNT: delCount,
})

export const countActions = { addCount, setCount, delCount }
export default countReducer
