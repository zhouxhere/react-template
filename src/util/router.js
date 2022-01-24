const findPath = (params, code) => {
  for (let i = 0; i < params.length; i++) {
    if (params[i].code === code) {
      return [params[i].path]
    } else {
      if (params[i].children) {
        let childPath = findPath(params[i].children, code)
        return childPath ? [params[i].path, ...childPath] : []
      }
      return []
    }
  }
}

const processRoutes = (routes, redirects) => {
  return redirects.map((item) => {
    let fromUrl = findPath(routes, item.from)
    if (fromUrl.length > 0) {
      fromUrl = fromUrl.join('/').replace('//', '/')
    }
    let toUrl = findPath(routes, item.to)
    if (toUrl.length > 0) {
      toUrl = toUrl.join('/').replace('//', '/')
    }
    return {
      ...item,
      fromUrl,
      toUrl,
    }
  })
}

export const routerTool = { processRoutes }
