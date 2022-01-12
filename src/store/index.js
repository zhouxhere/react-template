import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import storageEnhancer from './enhancer/storage'
import loggerMiddleware from './middleware/logger'
import countReducer from './reducer/count'
import todoReducer from './reducer/todo'

const reducer = combineReducers({
  todo: todoReducer,
  count: countReducer,
})
const middlewareEnhancer = applyMiddleware(loggerMiddleware, thunk)
const composedEnhancers = compose(middlewareEnhancer, storageEnhancer)

const store = createStore(reducer, composedEnhancers)

export default store
