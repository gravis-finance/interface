/* eslint-disable */
import { BASE_CURRENCIES, ChainId } from '@gravis.finance/sdk'
import { DAI, BUSD } from '../constants'
import currencyId from './currencyId'

describe('#currencyId', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('returns ETH on Ether', () => {
    expect(currencyId(BASE_CURRENCIES[ChainId.MAINNET])).toEqual('ETH')
  })

  it('returns ETH on DAI', () => {
    console.log('HELLOOOOOOO', DAI.address)
    expect(currencyId(DAI)).toEqual('0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3')
  })

  it('returns ETH on DAI', () => {
    expect(currencyId(BUSD)).toEqual('0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56')
  })
})
