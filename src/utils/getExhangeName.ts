const getExhangeName = (name) => {
  return name?.slice(0, name.indexOf('LP')).trim()
}

export default getExhangeName
