import { ChainId } from '@gravis.finance/sdk'
import { ConnectorNames as ConnectorNamesBase } from '@gravis.finance/uikit'

import { isProduction } from './commons'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Near, ...otherProps } = ConnectorNamesBase

export const ConnectorNames = {
  ...otherProps
}

export type ConnectorNames = Exclude<
  ConnectorNamesBase,
  ConnectorNamesBase.Near
>

export enum NETWORK_NAMES {
  BSC = 'BSC',
  HECO = 'HECO',
  MATIC = 'MATIC'
}

export const CHAIN_ID_NETWORK_NAME = {
  ...(isProduction
    ? {
        [ChainId.MAINNET]: NETWORK_NAMES.BSC,
        [ChainId.HECOMAINNET]: NETWORK_NAMES.HECO,
        [ChainId.MATICMAINNET]: NETWORK_NAMES.MATIC
      }
    : {
        [ChainId.BSCTESTNET]: NETWORK_NAMES.BSC,
        [ChainId.HECOTESTNET]: NETWORK_NAMES.HECO,
        [ChainId.MATICTESTNET]: NETWORK_NAMES.MATIC
      })
} as const

export const NETWORK_NAME_CHAIN_ID = Object.fromEntries<ChainId>(
  Object.entries(CHAIN_ID_NETWORK_NAME).map(([key, value]) => [
    value,
    parseInt(key)
  ])
) as Record<NETWORK_NAMES, ChainId>

export const SUPPORTED_CHAINS =
  process.env.REACT_APP_NODE_ENV === 'production'
    ? [ChainId.MAINNET, ChainId.MATICMAINNET, ChainId.HECOMAINNET]
    : [ChainId.BSCTESTNET, ChainId.MATICTESTNET, ChainId.HECOTESTNET]
