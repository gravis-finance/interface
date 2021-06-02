import { BscConnector } from '@binance-chain/bsc-connector'

describe('BscConnector', () => {
  describe('#activate', () => {
    it('no window provider', () => {
      const bscConnector = new BscConnector({ supportedChainIds: [56, 97] })

      expect(() => {
        expect.assertions(1)
        return bscConnector
          .activate()
          .catch((e) => expect(e).toMatch('No BSC provider was found on window.BinanceChain.'))
      })
    })
  })

  describe('#getChainId', () => {
    it('no window provider', () => {
      const bscConnector = new BscConnector({ supportedChainIds: [56, 97] })
      expect(() => {
        expect.assertions(1)
        return bscConnector
          .getChainId()
          .catch((e) => expect(e).toMatch('No BSC provider was found on window.BinanceChain.'))
      })
    })
  })

  describe('#getAccount', () => {
    it('no window provider', () => {
      // console.log(window.BinanceChain);
      const bscConnector = new BscConnector({ supportedChainIds: [56, 97] })
      expect(() => {
        expect.assertions(1)
        return bscConnector
          .getAccount()
          .catch((e) => expect(e).toMatch('No BSC provider was found on window.BinanceChain.'))
      })
    })
  })

  describe('#isAuthorized', () => {
    it('no window provider', () => {
      const bscConnector = new BscConnector({ supportedChainIds: [56, 97] })
      expect(() => {
        expect.assertions(1)
        return bscConnector
          .isAuthorized()
          .catch((e) => expect(e).toMatch('No BSC provider was found on window.BinanceChain.'))
      })
    })
  })
})
