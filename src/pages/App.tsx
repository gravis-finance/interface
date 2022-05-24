import {
  NetworkSwitchError,
  NotFound,
  getNetworkId,
  useModal
} from '@gravis.finance/uikit'
import React, { Suspense, lazy, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Redirect,
  Route,
  RouteProps,
  Switch,
  useLocation
} from 'react-router-dom'
import styled from 'styled-components'

import backgroundImage from 'assets/svg/trade-background.svg'
import { isProduction } from 'constants/commons'
import { SUPPORTED_CHAINS } from 'constants/network'
import { useActiveWeb3React } from 'hooks'
import useEagerConnect from 'hooks/useEagerConnect'
import useToast from 'hooks/useToast'
import { setupNetwork } from 'utils/wallet'

import Menu from '../components/Menu'
import PageLoader from '../components/PageLoader'
import Web3ReactManager from '../components/Web3ReactManager'
import Landing from './Landing/Landing'
import { RedirectOldRemoveLiquidityPathStructure } from './RemoveLiquidity/redirects'
import { RedirectPathToSwapOnly, RedirectToSwap } from './Swap/redirects'

const Pool = lazy(() => import('./Pool'))
const PoolFinder = lazy(() => import('./PoolFinder'))
const RemoveLiquidity = lazy(() => import('./RemoveLiquidity'))
const Swap = lazy(() => import('./Swap'))
const Migrate = lazy(() => import('./Migrate'))
const AddLiquidity = lazy(() => import('./AddLiquidity'))
const RedirectDuplicateTokenIds = lazy(() =>
  import('./AddLiquidity/redirects').then(
    ({ RedirectDuplicateTokenIds: component }) => ({ default: component })
  )
)
const RedirectOldAddLiquidityPathStructure = lazy(() =>
  import('./AddLiquidity/redirects').then(
    ({ RedirectOldAddLiquidityPathStructure: component }) => ({
      default: component
    })
  )
)
const RedirectToAddLiquidity = lazy(() =>
  import('./AddLiquidity/redirects').then(
    ({ RedirectToAddLiquidity: component }) => ({ default: component })
  )
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

const DefaultRoute = ({ ...props }: RouteProps) => {
  useEagerConnect()
  const { t } = useTranslation()
  const provider = window.ethereum
  const location = useLocation()
  const { account } = useActiveWeb3React()
  const chainId = getNetworkId()
  const [providerChainId, setProviderChainId] = React.useState<string>(
    provider?.networkVersion
  )
  const isSupportedChain = React.useMemo(
    () => !SUPPORTED_CHAINS.includes(parseInt(providerChainId)),
    [providerChainId]
  )
  const { toastWarning } = useToast()

  const handleChangeNetwork = React.useCallback(() => {
    setupNetwork(chainId).then((result) => {
      if (!result) {
        toastWarning(t('pendingActionInWallet'))
      }
    })
  }, [chainId, t, toastWarning])

  const errorModal = React.useMemo(
    () => (
      <NetworkSwitchError
        isSupportedChain={isSupportedChain}
        isProduction={isProduction}
        changeNetwork={handleChangeNetwork}
        networkSwitchItemCallback={(returnedChainId) =>
          localStorage.setItem('chainId', returnedChainId)
        }
      />
    ),
    [isSupportedChain, handleChangeNetwork]
  )

  // useModal hook run update every time any modal is open.
  // don't add openModal and onDismiss to useEffect deps as it cause bugs
  const [openErrorModal, onDismissErrorModal] = useModal(errorModal, false)

  React.useEffect(() => {
    const handleChange = (newChainId) => {
      setProviderChainId(parseInt(newChainId, 16).toString())
    }
    provider?.on('chainChanged', handleChange)
  }, [provider]) // eslint-disable-line

  useEffect(() => {
    if (!account) return
    if (chainId !== providerChainId && chainId && providerChainId) {
      openErrorModal()
    } else {
      onDismissErrorModal()
    }
  }, [account, chainId, providerChainId]) // eslint-disable-line

  // redirect to supported chain id
  if (!chainId || !SUPPORTED_CHAINS?.includes(parseInt(chainId))) {
    return (
      <Redirect
        to={{
          ...location,
          search: `?network=${
            localStorage.getItem('chainId') ||
            parseInt(process.env.REACT_APP_CHAIN_ID as string, 10)
          }`
        }}
      />
    )
  }

  return <Route {...props} />
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Web3ReactManager>
        <Switch>
          <DefaultRoute exact path="/" component={Landing} />
          <AppWrapper>
            <BodyWrapper>
              <Menu loginBlockVisible>
                <Switch>
                  <DefaultRoute exact strict path="/swap" component={Swap} />
                  <DefaultRoute
                    exact
                    strict
                    path="/swap/:outputCurrency"
                    component={RedirectToSwap}
                  />
                  <DefaultRoute
                    exact
                    strict
                    path="/send"
                    component={RedirectPathToSwapOnly}
                  />
                  <DefaultRoute
                    exact
                    strict
                    path="/migrate"
                    component={Migrate}
                  />
                  <DefaultRoute
                    exact
                    strict
                    path="/find"
                    component={PoolFinder}
                  />
                  <DefaultRoute exact strict path="/pool" component={Pool} />
                  <DefaultRoute
                    exact
                    strict
                    path="/create"
                    component={RedirectToAddLiquidity}
                  />
                  <DefaultRoute exact path="/add" component={AddLiquidity} />
                  <DefaultRoute
                    exact
                    path="/add/:currencyIdA"
                    component={RedirectOldAddLiquidityPathStructure}
                  />
                  <DefaultRoute
                    exact
                    path="/add/:currencyIdA/:currencyIdB"
                    component={RedirectDuplicateTokenIds}
                  />
                  <DefaultRoute
                    exact
                    strict
                    path="/remove/:tokens"
                    component={RedirectOldRemoveLiquidityPathStructure}
                  />
                  <DefaultRoute
                    exact
                    strict
                    path="/remove/:currencyIdA/:currencyIdB"
                    component={RemoveLiquidity}
                  />
                  <Route>
                    <NotFound redirectURL={process.env.REACT_APP_HOME_URL} />
                  </Route>
                </Switch>
              </Menu>
            </BodyWrapper>
          </AppWrapper>
        </Switch>
      </Web3ReactManager>
    </Suspense>
  )
}
