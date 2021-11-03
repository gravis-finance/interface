import { useCallback } from 'react'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { NoBscProviderError } from '@binance-chain/bsc-connector'
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector'
import {
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
  WalletConnectConnector,
} from '@web3-react/walletconnect-connector'
import { connectorLocalStorageKey, ConnectorNames } from '@gravis.finance/uikit'
import useToast from 'state/hooks'
import { getConnectorsByName } from '../utils/web3React'
import { setupNetwork } from '../utils/wallet'

const parseErrorMessage = (message) => {
  return message.replace(/,/g, ', ')
}

const useAuth = () => {
  const { activate, deactivate } = useWeb3React()
  const { toastError } = useToast()

  // const provider: any = (window as WindowChain).ethereum

  const login = useCallback(
    (connectorID: ConnectorNames) => {
      const { chainId, connector } = getConnectorsByName(connectorID)

      // if (provider?.networkVersion !== chainId) {
      //   setupNetwork(chainId)
      // }

      if (connector) {
        activate(connector, async (error: Error) => {
          if (error instanceof UnsupportedChainIdError) {
            const hasSetup = await setupNetwork(chainId)
            if (hasSetup) {
              try {
                activate(connector, (err) => console.error('err :>> ', err))
              } catch (err) {
                console.error('err :>> ', err)
              }
            }
          }
          if (error instanceof NoEthereumProviderError || error instanceof NoBscProviderError) {
            toastError('Provider Error', 'No provider was found')
            window.localStorage.removeItem(connectorLocalStorageKey)
          } else if (
            error instanceof UserRejectedRequestErrorInjected ||
            error instanceof UserRejectedRequestErrorWalletConnect
          ) {
            if (connector instanceof WalletConnectConnector) {
              const walletConnector = connector as WalletConnectConnector
              walletConnector.walletConnectProvider = null
            }
            window.localStorage.removeItem(connectorLocalStorageKey)
            toastError('Authorization Error', 'Please authorize to access your account')
          } else {
            toastError(error.name, parseErrorMessage(error.message))
            console.error(error)
          }
        })
      } else {
        toastError("Can't find connector", 'The connector config is wrong')
      }
    },
    [activate, toastError]
  )

  return { login, logout: deactivate }
}

export default useAuth
