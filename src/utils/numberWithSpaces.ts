const numberWithSpaces = (number: string | number) => {
  if (number.toString().includes('.'))
    return `${number
      .toString()
      .split('.')[0]
      .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}.${
      number.toString().split('.')[1]
    }`
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

export default numberWithSpaces
