import { storeTool } from '../../util/store'

const addCount = (countState) => {
  return countState + 1
}

const setCount = (countState, param) => {
  return param
}

const delCount = (countState) => {
  return countState <= 0 ? 0 : countState - 1
}

const countReducer = storeTool.createReducer(0, {
  ADD_COUNT: addCount,
  SET_COUNT: setCount,
  DEL_COUNT: delCount,
})

export const countActions = { addCount, setCount, delCount }
export default countReducer
