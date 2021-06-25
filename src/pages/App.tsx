import React, { Suspense, lazy, useEffect, useRef, useCallback } from 'react'
import { Redirect, Route, RouteProps, Switch, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { getNetworkId, NetworkSwitchError, NotFound, useModal, Modal, Button } from '@gravis.finance/uikit'
import { useTranslation } from 'react-i18next'

import backgroundImage from 'assets/svg/trade-background.svg'
import useEagerConnect from 'hooks/useEagerConnect'

import { setupNetwork } from 'utils/wallet'
import { useActiveWeb3React } from 'hooks'
import useToast from 'hooks/useToast'
import { RedirectOldRemoveLiquidityPathStructure } from './RemoveLiquidity/redirects'
import { RedirectPathToSwapOnly, RedirectToSwap } from './Swap/redirects'
import Menu from '../components/Menu'
import PageLoader from '../components/PageLoader'
import Web3ReactManager from '../components/Web3ReactManager'
import Spinner from '../components/GravisSpinner'

const Pool = lazy(() => import('./Pool'))
const PoolFinder = lazy(() => import('./PoolFinder'))
const RemoveLiquidity = lazy(() => import('./RemoveLiquidity'))
const Swap = lazy(() => import('./Swap'))
const Migrate = lazy(() => import('./Migrate'))
const AddLiquidity = lazy(() => import('./AddLiquidity'))
const RedirectDuplicateTokenIds = lazy(() =>
  import('./AddLiquidity/redirects').then(({ RedirectDuplicateTokenIds: component }) => ({ default: component }))
)
const RedirectOldAddLiquidityPathStructure = lazy(() =>
  import('./AddLiquidity/redirects').then(({ RedirectOldAddLiquidityPathStructure: component }) => ({
    default: component,
  }))
)
const RedirectToAddLiquidity = lazy(() =>
  import('./AddLiquidity/redirects').then(({ RedirectToAddLiquidity: component }) => ({ default: component }))
)

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  overflow-x: hidden;
  width: 100%;
`

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 32px 20%;
  padding: 32px 24px;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 1;
  justify-content: center;

  background-image: url(${backgroundImage});
  background-repeat: no-repeat;
  background-position: top right;

  ${({ theme }) => theme.mediaQueries.lg} {
    background-image: url(${backgroundImage});
    background-repeat: no-repeat;
    background-position: top right;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 24px 18.6% 32px 18.6%;
  }

  @media screen and (max-width: 1024px) {
    padding: 38px 24px;
  }
  @media screen and (max-width: 525px) {
    padding: 32px 11px;
  }
`

const isProduction = process.env.REACT_APP_NODE_ENV === 'production'
const supportedChains = isProduction ? ['56', '128', '137'] : ['97', '256', '80001']

const DefaultRoute = ({ ...props }: RouteProps) => {
  useEagerConnect()
  const { t } = useTranslation()
  const provider: any = (window as WindowChain).ethereum
  const loginBlockVisible = true
  const location = useLocation()
  const { account } = useActiveWeb3React()
  const chainId = getNetworkId()
  const [providerChainId, setProviderChainId] = React.useState<string>(provider?.networkVersion)
  const isSupportedChain = React.useMemo(() => supportedChains.indexOf(providerChainId) !== -1, [providerChainId])
  const { toastWarning } = useToast()

  const handleChangeNetwork = React.useCallback(() => {
    setupNetwork(chainId).then((result) => {
      if (!result) {
        toastWarning(t('You have a pending action in the wallet.'))
      }
    })
  }, [chainId, t, toastWarning])

  const errorModal = React.useMemo(
    () => (
      <NetworkSwitchError
        isSupportedChain={isSupportedChain}
        isProduction={isProduction}
        changeNetwork={handleChangeNetwork}
      />
    ),
    [isSupportedChain, handleChangeNetwork]
  )

  // useModal hook run update every time any modal is open.
  // don't add openModal and onDismiss to useEffect deps as it cause bugs
  const [openErrorModal, onDismissErrorModal] = useModal(errorModal, false)

  const handleConfirm = useCallback(() => {
    if (chainId !== providerChainId) {
      openErrorModal()
    }
  }, [chainId, providerChainId]) // eslint-disable-line

  const loadingNetworkModal = React.useMemo(
    () => (
      <Modal hideCloseButton styledModalContent={{ padding: 30, display: 'flex', alignItems: 'center' }} title="Please, confirm network change">
        <Spinner width="120px" />
        <Button marginTop="30px" onClick={handleConfirm}>{t('Continue')}</Button>
      </Modal>
    ),
    [t, handleConfirm]
  )

  const [openLoadingNetworkModal, onDismissLoadingNetworkModal] = useModal(loadingNetworkModal, false)

  React.useEffect(() => {
    const handleChange = (newChainId) => {
      setProviderChainId(parseInt(newChainId, 16).toString())
    }
    provider?.on('chainChanged', handleChange)
  }, [provider]) // eslint-disable-line

  const timeoutId = useRef<any>()

  useEffect(() => {
    if (!account) return
    if (chainId !== providerChainId) {
      openLoadingNetworkModal()
      timeoutId.current = setTimeout(() => openErrorModal(), 10000)
    } else {
      clearTimeout(timeoutId.current)
      onDismissLoadingNetworkModal()
      onDismissErrorModal()
    }
  }, [account, chainId, providerChainId]) // eslint-disable-line

  // redirect to supported chain id
  if (!chainId || supportedChains?.indexOf(chainId) === -1) {
    return (
      <Redirect
        to={{
          ...location,
          search: `?network=${localStorage.getItem('chainId') || parseInt(process.env.REACT_APP_CHAIN_ID as string, 10)
            }`,
        }}
      />
    )
  }

  return (
    <Menu loginBlockVisible={loginBlockVisible}>
      <BodyWrapper>
        <Route {...props} />
      </BodyWrapper>
    </Menu>
  )
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <AppWrapper>
        <Web3ReactManager>
          <Switch>
            <DefaultRoute exact path="/" component={() => <Redirect to="/swap" />} />
            <DefaultRoute exact strict path="/swap" component={Swap} />
            <DefaultRoute exact strict path="/swap/:outputCurrency" component={RedirectToSwap} />
            <DefaultRoute exact strict path="/send" component={RedirectPathToSwapOnly} />
            <DefaultRoute exact strict path="/migrate" component={Migrate} />
            <DefaultRoute exact strict path="/find" component={PoolFinder} />
            <DefaultRoute exact strict path="/pool" component={Pool} />
            <DefaultRoute exact strict path="/create" component={RedirectToAddLiquidity} />
            <DefaultRoute exact path="/add" component={AddLiquidity} />
            <DefaultRoute exact path="/add/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
            <DefaultRoute exact path="/add/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
            <DefaultRoute exact strict path="/remove/:tokens" component={RedirectOldRemoveLiquidityPathStructure} />
            <DefaultRoute exact strict path="/remove/:currencyIdA/:currencyIdB" component={RemoveLiquidity} />
            <Route>
              <Menu loginBlockVisible={false}>
                <NotFound redirectURL={process.env.REACT_APP_HOME_URL} />
              </Menu>
            </Route>
          </Switch>
        </Web3ReactManager>
      </AppWrapper>
    </Suspense>
  )
}
