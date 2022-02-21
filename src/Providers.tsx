import React from 'react'
import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core'
import { Provider } from 'react-redux'
import { ModalProvider, QueryProvider } from '@gravis.finance/uikit'

import { NetworkContextNames } from 'config/settings'
import store from './state'
import getLibrary from './utils/getLibrary'
import { ThemeContextProvider } from './ThemeContext'

const Web3BSCProviderNetwork = createWeb3ReactRoot(NetworkContextNames.BSC)
const Web3HECOProviderNetwork = createWeb3ReactRoot(NetworkContextNames.HECO)
const Web3MATICProviderNetwork = createWeb3ReactRoot(NetworkContextNames.MATIC)

const Providers: React.FC = ({ children }) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3BSCProviderNetwork getLibrary={getLibrary}>
        <Web3HECOProviderNetwork getLibrary={getLibrary}>
          <Web3MATICProviderNetwork getLibrary={getLibrary}>
            <QueryProvider>
              <Provider store={store}>
                <ThemeContextProvider>
                  <ModalProvider>{children}</ModalProvider>
                </ThemeContextProvider>
              </Provider>
            </QueryProvider>
          </Web3MATICProviderNetwork>
        </Web3HECOProviderNetwork>
      </Web3BSCProviderNetwork>
    </Web3ReactProvider>
  )
}

export default Providers
