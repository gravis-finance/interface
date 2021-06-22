import React, { Suspense, lazy, useEffect, useState } from 'react'
import { Redirect, Route, RouteProps, Switch, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { getNetworkId, NetworkSwitchError, NotFound, useModal, Modal } from '@gravis.finance/uikit'

import backgroundImage from 'assets/svg/trade-background.svg'
import useEagerConnect from 'hooks/useEagerConnect'

import { setupNetwork } from 'utils/wallet'
import { useActiveWeb3React } from 'hooks'
import { useDebounce } from 'use-debounce'
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
  const provider: any = (window as WindowChain).ethereum
  const loginBlockVisible = true
  const location = useLocation()
  const { account } = useActiveWeb3React()
  const chainId = getNetworkId()
  const [providerChainId, setProviderChainId] = React.useState<string>(provider?.networkVersion)
  const isSupportedChain = React.useMemo(() => supportedChains.indexOf(providerChainId) !== -1, [providerChainId])
  const handleChangeNetwork = React.useCallback(() => {
    setupNetwork(chainId)
  }, [chainId])

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

  const loadingNetworkModal = React.useMemo(
    () => (
      <Modal
        hideCloseButton
        styledModalContent={{ padding: 110 }}
        title="Please, confirm network change"
      >
        <Spinner />
      </Modal>
    ),
    []
  )

  // useModal hook run update every time any modal is open.
  // don't add openModal and onDismiss to useEffect deps as it cause bugs
  const [openLoadingNetworkModal, onDismissLoadingNetworkModal] = useModal(loadingNetworkModal, false)
  const [openErrorModal, onDismissErrorModal] = useModal(errorModal, false)
  const [isMouseOuted, setIsMouseOuted] = useState(false)
  const [debouncedIsMouseOuted] = useDebounce(isMouseOuted, 500)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [deboucedShowErrorModal] = useDebounce(showErrorModal, 1000)
  React.useEffect(() => {
    const handleChange = (newChainId) => {
      setProviderChainId(parseInt(newChainId, 16).toString())
    }
    provider?.on('chainChanged', handleChange)
  }, [provider]) // eslint-disable-line

  useEffect(() => {
    if (!account) return
    if (chainId !== providerChainId)
      if(deboucedShowErrorModal)
        openErrorModal()
      else
        openLoadingNetworkModal()
    else {
      setShowErrorModal(false)
      onDismissLoadingNetworkModal()
      onDismissErrorModal()
    }
  }, [account, chainId, providerChainId, deboucedShowErrorModal]) // eslint-disable-line

  // this construction was added for cancel metamask handling
  useEffect(() => {
    const handleMouseOut = () => {
      setIsMouseOuted(true)
    }
    const handleMouseOver = () => {
      if (chainId !== providerChainId && debouncedIsMouseOuted) {
        setShowErrorModal(true)
      }
      setIsMouseOuted(false)
    }

    document.addEventListener('mouseleave', handleMouseOut)
    document.addEventListener('mouseover', handleMouseOver)
    return () => {
      document.removeEventListener('mouseleave', handleMouseOut)
      document.removeEventListener('mouseover', handleMouseOver)
    }
  }, [debouncedIsMouseOuted, chainId, providerChainId]) // eslint-disable-line


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
