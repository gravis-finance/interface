import { ChainId } from '@gravis.finance/sdk'
import random from 'lodash/random'

import { ChainIdType } from 'constants/chain'

const bscNodes = [process.env.REACT_APP_NODE_1, process.env.REACT_APP_NODE_2, process.env.REACT_APP_NODE_3]
const hecoNodes = [process.env.REACT_APP_HECO_NODE_1]
const maticNodes = [process.env.REACT_APP_MATIC_NODE_1, process.env.REACT_APP_MATIC_NODE_2]

// Array of available nodes to connect to
export const nodes: { [chainId in ChainIdType]: any } = {
  [ChainId.MAINNET]: bscNodes,
  [ChainId.BSCTESTNET]: bscNodes,
  [ChainId.HECOMAINNET]: hecoNodes,
  [ChainId.HECOTESTNET]: hecoNodes,
  [ChainId.MATICMAINNET]: maticNodes,
  [ChainId.MATICTESTNET]: maticNodes,
}

const getNodeUrl = (chainId: ChainId) => {
  const randomIndex = random(0, nodes[chainId].length - 1)
  return nodes[chainId][randomIndex]
}

export default getNodeUrl
