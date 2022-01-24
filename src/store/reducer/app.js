import defaultApp from '../../config/defaultApp'
import { copyTool } from '../../util/copy'
import { storeTool } from '../../util/store'

const fetch = async (state) => {
  return state
}

const update = async (state, ...props) => {
  return copyTool.merger(state, ...props)()
}

const appReducer = storeTool.createReducer(defaultApp, {
  APP_FETCH: fetch,
  APP_UPDATE: update,
})

export default appReducer
