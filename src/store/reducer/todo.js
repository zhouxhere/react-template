import { storeTool } from '../../util/store'

const addTodo = (todoState, param) => {
  const newTodo = todoState.concat(param)
  return newTodo
}

const editTodo = (todoState, param) => {
  const _index = todoState.findIndex((item) => item.id === param.id)
  if (_index < 0) return newTodo
  const newTodo = storeTool.updateItemInArray(todoState, _index, (item) => {
    return storeTool.updateObject(item, param)
  })
  return newTodo
}

const delTodo = (todoState, param) => {
  const _index = todoState.findIndex((item) => item.id === param.id)
  if (_index < 0) return newTodo
  const newTodo = todoState.splice(_index, 1)
  return newTodo
}

const todoReducer = storeTool.createReducer([{ id: 1, name: 'hello' }], {
  ADD_TODO: addTodo,
  EDIT_TODO: editTodo,
  DEL_TODO: delTodo,
})

export default todoReducer
