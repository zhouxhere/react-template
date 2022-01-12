// 将 redux 数据 持久化 至 localstorage
const storageEnhancer = (next) => (reducer) => {
  let store = next(reducer)

  let persistedState
  let initialState = store.getState()

  try {
    persistedState = JSON.parse(localStorage.getItem('redux'))
    if (persistedState && initialState) {
      Object.keys(initialState).forEach((key) => {
        if (persistedState[key]) {
          initialState[key] = persistedState[key]
        }
      })
      store = next(reducer, initialState)
    }
    if (initialState) {
      localStorage.setItem('redux', JSON.stringify(initialState))
    }
  } catch (e) {
    console.warn('Failed to retrieve initialize state from localStorage:', e)
  }

  // 主要代码
  store.subscribe(async function () {
    const state = await store.getState()

    try {
      localStorage.setItem('redux', JSON.stringify(state))
    } catch (e) {
      console.warn('Unable to persist state to localStorage:', e)
    }
  })

  return store
}

export default storageEnhancer
