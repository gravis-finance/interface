import { ConnectorNames } from '@gravis.finance/uikit'
import { getConnectorsByName } from './web3React'

describe('web3React', () => {
  describe('#getConnectorsByName', () => {
    it('returns injected connector', () => {
      expect(getConnectorsByName(ConnectorNames.Injected).chainId).toEqual(97)
    })

    it('returns BSC connector', () => {
      expect(getConnectorsByName(ConnectorNames.BSC).chainId).toEqual(97)
    })

    it('returns WalletConnect connector', () => {
      expect(getConnectorsByName(ConnectorNames.WalletConnect).chainId).toEqual(97)
    })
  })
})
