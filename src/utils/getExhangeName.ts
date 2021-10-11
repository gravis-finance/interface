const getExhangeName = (name) => {
  const cuttedName = name?.slice(0, name.indexOf('LP')).trim()
  if (cuttedName.toLowerCase().includes('finance'))
    return cuttedName.slice(0, cuttedName.toLowerCase().indexOf('finance')).trim()
  return cuttedName
}

export default getExhangeName
