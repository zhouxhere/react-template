const findPath = (params, code) => {
  let paths = []
  for (let i = 0; i < params.length; i++) {
    if (params[i].code === code) {
      paths = [params[i].path]
      break
    }
    if (params[i].children) {
      let childPath = findPath(params[i].children, code)
      if (childPath.length > 0) {
        paths = [params[i].path, ...childPath]
      }
    }
    if (i === params.length - 1) {
      break
    }
  }
  return paths
}

const processRoutes = (routes, redirects) => {
  return redirects.map((item) => {
    let fromUrl = findPath(routes, item.from)
    if (fromUrl.length > 0) {
      fromUrl = fromUrl.join('/').replace('//', '/')
    } else {
      fromUrl = ''
    }
    let toUrl = findPath(routes, item.to)
    if (toUrl.length > 0) {
      toUrl = toUrl.join('/').replace('//', '/')
    } else {
      toUrl = ''
    }
    return {
      ...item,
      fromUrl,
      toUrl,
    }
  })
}

export const routerTool = { processRoutes }
