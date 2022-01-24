import * as defaultTheme from '../../config/defaultTheme'
import { copyTool } from '../../util/copy'
import { storeTool } from '../../util/store'

const updateTheme = (state, params) => {
  return copyTool.merger(state, params)()
}

const resetTheme = () => {
  return defaultTheme
}

const saveTheme = (themeState) => {
  return themeState
}

const themeReducer = storeTool.createReducer(defaultTheme, {
  THEME_UPDATE: updateTheme,
  THEME_RESET: resetTheme,
  THEME_SAVE: saveTheme,
})

export default themeReducer
