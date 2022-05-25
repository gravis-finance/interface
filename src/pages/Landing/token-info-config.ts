import APE_IMAGE from 'assets/images/landing/more-info-projects/ape.svg'
import COINMARKETCAP_IMAGE from 'assets/images/landing/more-info-projects/coinmarketcap.svg'
import DEXGURU_IMAGE from 'assets/images/landing/more-info-projects/dexguru.svg'
import GSWAP_IMAGE from 'assets/images/landing/more-info-projects/gswap.svg'
import GRVS_IMAGE from 'assets/images/landing/tokens/grvs.svg'
import GRVX_IMAGE from 'assets/images/landing/tokens/grvx.svg'
import { NETWORK_NAME_CHAIN_ID } from 'constants/network'
import getTokenAddress from 'utils/getTokenAddress'

const GRVX_MORE_INFO = {
  [NETWORK_NAME_CHAIN_ID.BSC]: {
    DEXGURU:
      'https://dex.guru/token/0xa349fd455a457467d31ca8db59052daebbbcc108-bsc',
    GSWAP:
      'https://info.gravis.finance/token/0xa349fd455a457467d31ca8db59052daebbbcc108?network=binance'
  },
  [NETWORK_NAME_CHAIN_ID.MATIC]: {
    DEXGURU:
      'https://dex.guru/token/0xd322da59c420e0827e31c40f1886346fb19c6687-polygon',
    GSWAP:
      'https://info.gravis.finance/token/0xd322da59c420e0827e31c40f1886346fb19c6687?network=polygon'
  }
}

const GRVS_MORE_INFO = {
  [NETWORK_NAME_CHAIN_ID.BSC]: {
    PANCAKE:
      'https://pancakeswap.finance/info/token/0x190CEC0657a02E9eAB1C1DF5d59f9139131cf539',
    COINMARKETCAP: 'https://coinmarketcap.com/currencies/gravis-finance/',
    GSWAP:
      'https://info.gravis.finance/token/0x190CEC0657a02E9eAB1C1DF5d59f9139131cf539?network=binance',
    APE: 'https://info.apeswap.finance/token/0x190CEC0657a02E9eAB1C1DF5d59f9139131cf539'
  },
  [NETWORK_NAME_CHAIN_ID.MATIC]: {
    PANCAKE:
      'https://pancakeswap.finance/info/token/0x190CEC0657a02E9eAB1C1DF5d59f9139131cf539',
    COINMARKETCAP: 'https://coinmarketcap.com/currencies/gravis-finance/',
    GSWAP:
      'https://info.gravis.finance/token/0x190CEC0657a02E9eAB1C1DF5d59f9139131cf539?network=polygon',
    APE: 'https://info.apeswap.finance/token/0x190CEC0657a02E9eAB1C1DF5d59f9139131cf539'
  }
}

const TOKEN_INFO_CONFIG = [
  {
    icon: GRVS_IMAGE,
    title: 'GRVS',
    description:
      'Governance token with limited emission to rule any Gravis Finance product',
    marketCap: '2 348 423',
    maxSupply: '150M',
    getBuyLink: (network) =>
      `/swap?network=${network}&inputCurrency=${getTokenAddress(
        network,
        'BUSD'
      )}&outputCurrency=${getTokenAddress(network, 'GRVS')}`,
    moreInfo: [
      {
        icon: APE_IMAGE,
        title: 'ApeSwap',
        getLink: (network) => GRVS_MORE_INFO[network].APE
      },
      {
        icon: GSWAP_IMAGE,
        title: 'Gswap',
        getLink: (network) => GRVS_MORE_INFO[network].GSWAP
      },
      {
        icon: COINMARKETCAP_IMAGE,
        title: 'CoinMarket Cap',
        getLink: (network) => GRVS_MORE_INFO[network].COINMARKETCAP
      }
    ]
  },
  {
    icon: GRVX_IMAGE,
    title: 'GRVX',
    description:
      'Unlimited supply, reward for various activities. Farm, autofarm, mine, use it to buy loot boxes, bridge it',
    marketCap: '2 348 423',
    maxSupply: undefined,
    getBuyLink: (network) =>
      `/swap?network=${network}&inputCurrency=${getTokenAddress(
        network,
        'BUSD'
      )}&outputCurrency=${getTokenAddress(network, 'GRVX')}`,
    moreInfo: [
      {
        icon: GSWAP_IMAGE,
        title: 'Gswap',
        getLink: (network) => GRVX_MORE_INFO[network].GSWAP
      },
      {
        icon: DEXGURU_IMAGE,
        title: 'DexGuru',
        getLink: (network) => GRVX_MORE_INFO[network].DEXGURU
      }
    ]
  }
]

export default TOKEN_INFO_CONFIG
