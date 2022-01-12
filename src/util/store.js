const updateObject = (oldVal, newVal) => {
  return Object.assign({}, oldVal, newVal)
}

const updateItemInArray = (array, index, updateCallback) => {
  const updatedArray = array.map((_item, _index) => {
    if (_index !== index) {
      return _item
    }

    const updatedItem = updateCallback(_item)
    return updatedItem
  })

  return updatedArray
}

const createReducer = (initialState, handlers) => {
  return function reducer(state = initialState, action) {
    if (Object.prototype.hasOwnProperty.call(handlers, action.type)) {
      return handlers[action.type](state, action)
    } else {
      return state
    }
  }
}

export const storeTool = { createReducer, updateObject, updateItemInArray }
