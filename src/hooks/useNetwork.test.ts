import { ChainId } from '@gravis.finance/sdk'
import { Web3Provider } from '@ethersproject/providers'
import getNodeUrl from 'utils/getRpcUrl'
import { getNetworkLibrary } from './useNetwork'
import { NetworkConnector } from '../connectors/NetworkConnector'

describe('connector index', () => {
  describe('#getNetworkLibrary', () => {
    it('add new library if it was not provided', () => {
      const chainId = ChainId.MAINNET
      const networkUrl = getNodeUrl(chainId) as string
      const networkConnector = new NetworkConnector({
        urls: { [chainId]: networkUrl },
      })
      const networkConnectors = { [chainId]: networkConnector }

      const result = getNetworkLibrary(chainId, networkConnectors)

      expect(typeof result).toEqual(typeof new Web3Provider(networkConnector.provider as any))
    })

    it('return old network library if it was added', () => {
      const chainId = ChainId.MAINNET
      const networkUrl = getNodeUrl(chainId) as string
      const networkConnector = new NetworkConnector({
        urls: { [chainId]: networkUrl },
      })
      const networkConnectors = { [chainId]: networkConnector }
      const expectedResult = getNetworkLibrary(chainId, networkConnectors)

      const result = getNetworkLibrary(chainId, networkConnectors)

      expect(result).toBe(expectedResult)
    })
  })
})
