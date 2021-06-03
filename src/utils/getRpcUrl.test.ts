import { ChainId } from '@gravis.finance/sdk'
import getNodeUrl from './getRpcUrl'

describe('#getNodeUrl', () => {
  if (process.env.TEST_ENV === 'production') {
    it('returns HECO main net url on HECO main net', () => {
      expect(getNodeUrl(ChainId.HECOMAINNET)).toEqual('https://http-mainnet.hecochain.com')
    })
  } else if (process.env.TEST_ENV === 'development') {
    it('returns HECO test net url on HECO main net in development', () => {
      expect(getNodeUrl(ChainId.HECOMAINNET)).toEqual('https://http-testnet.hecochain.com')
    })
  }
})
