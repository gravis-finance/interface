import { ChainId } from '@gravis.finance/sdk'

import bscTokens from './bsc.json'
import hecoTokens from './heco.json'
import maticTokens from './matic.json'

const DEFAULT_LIST: { [chainId in ChainId]: any } = {
  [ChainId.MAINNET]: bscTokens,
  [ChainId.BSCTESTNET]: bscTokens,
  [ChainId.HECOMAINNET]: hecoTokens,
  [ChainId.HECOTESTNET]: hecoTokens,
  [ChainId.MATICMAINNET]: maticTokens,
  [ChainId.MATICTESTNET]: maticTokens,
}

export default DEFAULT_LIST
