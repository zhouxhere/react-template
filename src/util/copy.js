const defineType = (param) => {
  let type = Object.prototype.toString.call(param)
  return type.split(' ')[1].split(']')[0]
}

const mergeObject = (target = {}, source, isJoin, isReplace, isFilter) => {
  for (const key in source) {
    if (Object.hasOwnProperty.call(target, key)) {
      if (isReplace) {
        target[key] = source[key]
      } else {
        target[key] = merger(target[key], source[key])(
          isJoin,
          isReplace,
          isFilter
        )
      }
    } else {
      if (isJoin) {
        target[key] = merger(target[key], source[key])(
          isJoin,
          isReplace,
          isFilter
        )
      }
    }
  }
  return target
}

const mergeArray = (target = [], source, isJoin, isReplace, isFilter) => {
  if (isJoin) {
    target = [...target, ...source]
  } else {
    for (let i = 0; i < source.length; i++) {
      if (isReplace) {
        target[i] = source[i]
      } else {
        target[i] = merger((target && target[i]) || undefined, source[i])(
          isJoin,
          isReplace,
          isFilter
        )
      }
    }
  }
  if (isFilter) {
    target = [...new Set(target)]
  }
  return target
}

const merger = (...props) => {
  let res
  const merge = (isJoin = true, isReplace = false, isFilter = true) => {
    for (let i = 0; i < props.length; i++) {
      switch (defineType(props[i])) {
        case 'Array':
          res = mergeArray(res, props[i], isJoin, isReplace, isFilter)
          break
        case 'Object':
          res = mergeObject(res, props[i], isJoin, isReplace, isFilter)
          break
        default:
          res = props[i]
          break
      }
    }
    return res
  }
  return merge
}

export const copyTool = { merger }
