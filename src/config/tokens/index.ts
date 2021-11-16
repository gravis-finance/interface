import { ChainId } from '@gravis.finance/sdk'

import { ChainIdType } from 'constants/chain'

import bscTokens from './bsc.json'
import hecoTokens from './heco.json'
import maticTokens from './matic.json'

const DEFAULT_LIST: { [chainId in ChainIdType]: any } = {
  [ChainId.MAINNET]: bscTokens,
  [ChainId.BSCTESTNET]: bscTokens,
  [ChainId.HECOMAINNET]: hecoTokens,
  [ChainId.HECOTESTNET]: hecoTokens,
  [ChainId.MATICMAINNET]: maticTokens,
  [ChainId.MATICTESTNET]: maticTokens,
}

export default DEFAULT_LIST
