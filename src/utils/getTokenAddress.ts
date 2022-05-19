import DEFAULT_LIST from 'config/tokens'

const getTokenAddress = (network, symbol) =>
  DEFAULT_LIST[network].tokens.find(
    (item) => network === item.chainId && item.symbol === symbol
  )?.address

export default getTokenAddress
