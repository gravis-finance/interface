import { InjectedConnector } from '@web3-react/injected-connector'

import { BscConnector } from './bsc/bscConnector'

export const injected = new InjectedConnector({
  supportedChainIds: [56, 97, 128, 256],
})

export const bsc = new BscConnector({ supportedChainIds: [56, 97, 128, 256] })
