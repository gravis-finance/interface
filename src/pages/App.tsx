import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Redirect, Route, RouteProps, Switch } from 'react-router-dom'
import styled from 'styled-components'
import { getNetworkId, NetworkSwitchError, NotFound, useModal } from '@gravis.finance/uikit'

import backgroundImage from 'assets/svg/trade-background.svg'
import useEagerConnect from 'hooks/useEagerConnect'

import { setupNetwork } from 'utils/wallet'
import { useActiveWeb3React } from 'hooks'
import { RedirectOldRemoveLiquidityPathStructure } from './RemoveLiquidity/redirects'
import { RedirectPathToSwapOnly, RedirectToSwap } from './Swap/redirects'
import Menu from '../components/Menu'
import PageLoader from '../components/PageLoader'
import Web3ReactManager from '../components/Web3ReactManager'

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
const provider: any = (window as WindowChain).ethereum

const DefaultRoute = ({ ...props }: RouteProps) => {
  const loginBlockVisible = true

  const { account } = useActiveWeb3React()
  const networkIdFromUrl = getNetworkId()
  const [chainId, setChainId] = React.useState<string>(provider?.networkVersion)
  const isSupportedChain = React.useMemo(() => supportedChains.indexOf(chainId) !== -1, [chainId])

  React.useEffect(() => {
    const handleChange = (newChainId) => {
      setChainId(parseInt(newChainId, 16).toString())
    }
    provider?.on('chainChanged', handleChange)
  }, [])

  const handleChangeNetwork = React.useCallback(() => {
    setupNetwork(networkIdFromUrl)
  }, [networkIdFromUrl])

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

  const [openModal, onDismiss] = useModal(errorModal, false)

  React.useEffect(() => {
    if (!account) return
    if (chainId !== networkIdFromUrl) {
      openModal()
    } else {
      onDismiss()
    }
  }, [openModal, onDismiss, networkIdFromUrl, chainId, account])

  return (
      <Menu loginBlockVisible={loginBlockVisible}>
        <BodyWrapper>
          <Route {...props} />
        </BodyWrapper>
      </Menu>
  )
}

export default function App() {
  useEagerConnect()

  // if chainId from url is not supported then redirect to supported chainId
  const networkIdFromUrl = getNetworkId()
  if (!networkIdFromUrl || supportedChains?.indexOf(networkIdFromUrl) === -1) {
    const chainIdFromStorage = localStorage.getItem('chainId')
    const newId = chainIdFromStorage || parseInt(process.env.REACT_APP_CHAIN_ID as string, 10)
    const newurl = `${window.location.protocol}//${window.location.host}${
        window.location.pathname
    }?network=${newId.toString()}`
    window.history.pushState({ path: newurl }, '', newurl)
    return null
  }

  return (
      <Router>
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
      </Router>
  )
}
