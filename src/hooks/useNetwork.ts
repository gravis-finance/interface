import { useEffect, useState } from 'react'
import { Web3Provider } from '@ethersproject/providers'

import getNodeUrl from 'utils/getRpcUrl'
import { ChainId } from '@gravis.finance/sdk'
import { NetworkConnector } from '../connectors/NetworkConnector'
import useParsedQueryString from './useParsedQueryString'
import { NetworkContextNames } from '../config/settings'

let networkLibraries: { [key: string]: Web3Provider } = {}
export const getNetworkLibrary = (chainId: ChainId, networkConnectors: any): Web3Provider => {
  if (!networkLibraries[chainId] && networkConnectors[chainId])
    networkLibraries = {
      ...networkLibraries,
      [chainId]: new Web3Provider(networkConnectors[chainId].provider as any),
    }
  return networkLibraries[chainId]
}

const useNetwork = () => {
  const [networkConnectors, setNetworkConnectors] = useState({})
  const { network } = useParsedQueryString() as { network: any }
  const newChainId: ChainId =
    Object.keys(ChainId).indexOf(network) === -1
      ? parseInt(process.env.REACT_APP_CHAIN_ID as string)
      : parseInt(network)

  // useEffect(() => {
  //   if (network && (window as any).ethereum?.networkVersion !== network) setupNetwork(network)
  // }, [network])

  useEffect(() => {
    const NETWORK_URL = getNodeUrl(newChainId) as any
    if (typeof NETWORK_URL === 'undefined') {
      throw new Error(`REACT_APP_NETWORK_URL must be a defined environment variable`)
    }
    setNetworkConnectors((oldNetworkConnectors) => {
      if (!oldNetworkConnectors[newChainId]) {
        const networkConnector = new NetworkConnector({
          urls: { [newChainId]: NETWORK_URL },
        })
        return { ...oldNetworkConnectors, [newChainId]: networkConnector }
      }
      return oldNetworkConnectors
    })
  }, [newChainId])

  let networkContextName
  if ([ChainId.MAINNET, ChainId.BSCTESTNET].includes(newChainId)) {
    networkContextName = NetworkContextNames.BSC
  } else if ([ChainId.HECOMAINNET, ChainId.MATICTESTNET].includes(newChainId)) {
    networkContextName = NetworkContextNames.HECO
  } else {
    networkContextName = NetworkContextNames.MATIC
  }

  return {
    network: newChainId,
    networkContextName,
    networkConnectors,
    networkLibrary: getNetworkLibrary(newChainId, networkConnectors),
  }
}

export default useNetwork
