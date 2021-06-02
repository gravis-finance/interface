import { getNetworkLibrary, network } from 'connectors'
import { Web3Provider } from '@ethersproject/providers'

describe('connector index', () => {
  describe('#getNetworkLibrary', () => {
    it('returns Web3Provider', () => {
      expect(typeof getNetworkLibrary()).toBe(typeof new Web3Provider(network.provider as any))
    })
  })
})
