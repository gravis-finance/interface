import React from 'react'
import { BASE_CURRENCIES, ChainId, Token } from '@gravis.finance/sdk'

import { ChainIdType } from 'constants/chain'

import useHttpLocations from './useHttpLocations'
import { WrappedTokenInfo } from '../state/lists/hooks'
import { useActiveWeb3React } from './index'
import BNBLogo from '../assets/images/binance-logo.png'
import HTlogo from '../assets/images/heco-logo.png'
import MATIClogo from '../assets/images/matic-logo.png'

const BaseLogo: { [chainId in ChainIdType]: string } = {
  [ChainId.MAINNET]: BNBLogo,
  [ChainId.BSCTESTNET]: BNBLogo,
  [ChainId.HECOMAINNET]: HTlogo,
  [ChainId.HECOTESTNET]: HTlogo,
  [ChainId.MATICMAINNET]: MATIClogo,
  [ChainId.MATICTESTNET]: MATIClogo,
}

const getTokenLogoURL = (address: string) =>
  `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/${address}/logo.png`

export default function useCurrencyImageSrcs(currency) {
  const { chainId } = useActiveWeb3React()
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)

  return React.useMemo(() => {
    if (chainId && currency === BASE_CURRENCIES[chainId as ChainId]) return [BaseLogo[chainId]]
    if (currency instanceof Token) {
      if (currency instanceof WrappedTokenInfo) {
        if (currency.lpTokenExchangeName) {
          return [
            currency?.lpTokenExchangeName
              ? `${window.location.origin}/images/exchanges/${currency?.lpTokenExchangeName.toLowerCase()}.png`
              : `${window.location.origin}/images/coins/${currency?.symbol ?? 'token'}.png`,
          ]
        }
        return [
          ...uriLocations,
          `${window.location.origin}/images/coins/${currency?.symbol ?? 'token'}.png`,
          getTokenLogoURL(currency.address),
        ]
      }

      return [
        `${window.location.origin}/images/coins/${currency?.symbol ?? 'token'}.png`,
        getTokenLogoURL(currency.address),
      ]
    }
    return []
  }, [currency, uriLocations, chainId])
}
