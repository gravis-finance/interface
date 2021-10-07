const getExhangeName = (name) => {
  switch (name) {
    case 'Pancake LPs':
      return 'Pancake'
    default:
      return undefined
  }
}

export default getExhangeName
