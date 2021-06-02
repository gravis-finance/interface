import { getNetworkId } from '@gravis.finance/uikit'
import { Web3Provider } from '@ethersproject/providers'
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'

import getNodeUrl from 'utils/getRpcUrl'
import { ChainId } from '@gravis.finance/sdk'
import { NetworkConnector } from './NetworkConnector'
import { BscConnector } from './bsc/bscConnector'

let id: string = getNetworkId()
if (Object.keys(ChainId).indexOf(id) === -1) {
  id = process.env.REACT_APP_CHAIN_ID as string
}

const chainId: any = id || parseInt(process.env.REACT_APP_CHAIN_ID as string, 10)
const NETWORK_URL = getNodeUrl(chainId)

export const NETWORK_CHAIN_ID: number = chainId

if (typeof NETWORK_URL === 'undefined') {
  throw new Error(`REACT_APP_NETWORK_URL must be a defined environment variable`)
}

export const network = new NetworkConnector({
  urls: { [NETWORK_CHAIN_ID]: NETWORK_URL },
})

let networkLibrary: Web3Provider | undefined
export function getNetworkLibrary(): Web3Provider {
  // eslint-disable-next-line no-return-assign
  return (networkLibrary = networkLibrary ?? new Web3Provider(network.provider as any))
}

export const injected = new InjectedConnector({
  supportedChainIds: [56, 97, 128, 256],
})

export const bsc = new BscConnector({ supportedChainIds: [56, 97, 128, 256] })

// mainnet only
export const walletconnect = new WalletConnectConnector({
  rpc: { 1: NETWORK_URL },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: 15000,
})

// mainnet only
export const walletlink = new WalletLinkConnector({
  url: NETWORK_URL,
  appName: 'GravisSwap',
  appLogoUrl:
    'https://mpng.pngfly.com/20181202/bex/kisspng-emoji-domain-unicorn-pin-badges-sticker-unicorn-tumblr-emoji-unicorn-iphoneemoji-5c046729264a77.5671679315437924251569.jpg',
})
