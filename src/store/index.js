import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import storageEnhancer from './enhancer/storage'
import loggerMiddleware from './middleware/logger'
import appReducer from './reducer/app'
import countReducer from './reducer/count'

const reducer = combineReducers({
  app: appReducer,
  count: countReducer,
})
const middlewareEnhancer = applyMiddleware(loggerMiddleware, thunk)
const composedEnhancers = compose(middlewareEnhancer, storageEnhancer)

const store = createStore(reducer, composedEnhancers)

export default store
