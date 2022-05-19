import {
  WidgetsProvider as BaseWidgetsProvider,
  ModalProvider,
  NETWORK_NAMES,
  QueryProvider
} from '@gravis.finance/uikit'
import { Web3ReactProvider, createWeb3ReactRoot } from '@web3-react/core'
import React from 'react'
import { Provider } from 'react-redux'

import { NetworkContextNames } from 'config/settings'
import { useActiveWeb3React } from 'hooks'

import { ThemeContextProvider } from './ThemeContext'
import store from './state'
import getLibrary from './utils/getLibrary'

const Web3BSCProviderNetwork = createWeb3ReactRoot(NetworkContextNames.BSC)
const Web3HECOProviderNetwork = createWeb3ReactRoot(NetworkContextNames.HECO)
const Web3MATICProviderNetwork = createWeb3ReactRoot(NetworkContextNames.MATIC)

const networks = [
  NETWORK_NAMES.BINANCE,
  NETWORK_NAMES.POLYGON,
  NETWORK_NAMES.HUOBI
]

const WidgetsProvider = ({ children }) => {
  const { chainId } = useActiveWeb3React()

  return (
    <BaseWidgetsProvider chainId={chainId} networks={networks}>
      {children}
    </BaseWidgetsProvider>
  )
}

const Providers: React.FC = ({ children }) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3BSCProviderNetwork getLibrary={getLibrary}>
        <Web3HECOProviderNetwork getLibrary={getLibrary}>
          <Web3MATICProviderNetwork getLibrary={getLibrary}>
            <QueryProvider>
              <Provider store={store}>
                <WidgetsProvider>
                  <ThemeContextProvider>
                    <ModalProvider>{children}</ModalProvider>
                  </ThemeContextProvider>
                </WidgetsProvider>
              </Provider>
            </QueryProvider>
          </Web3MATICProviderNetwork>
        </Web3HECOProviderNetwork>
      </Web3BSCProviderNetwork>
    </Web3ReactProvider>
  )
}

export default Providers
