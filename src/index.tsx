import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { ResetCSS } from '@gravis.finance/uikit'

import GlobalStyle from './style/Global'
import App from './pages/App'
import ApplicationUpdater from './state/application/updater'
import ListsUpdater from './state/lists/updater'
import MulticallUpdater from './state/multicall/updater'
import TransactionUpdater from './state/transactions/updater'
import ToastListener from './components/ToastListener'
import Providers from './Providers'
import './i18n'
import Popups from './components/Popups'

if ('ethereum' in window) {
  (window.ethereum as any).autoRefreshOnNetworkChange = false
}

window.addEventListener('error', () => {
  localStorage?.removeItem('redux_localstorage_simple_lists')
})

if (process.env.REACT_APP_NODE_ENV === 'production') {
  import('@sentry/react').then(({ init }) => {
    init({ dsn: 'https://e1bac36e1d5f4293af21e0b36b3b2728@sentry.gravis.finance/2' })
  })
}

ReactDOM.render(
  <StrictMode>
    <Providers>
      <>
        <ListsUpdater />
        <ApplicationUpdater />
        <TransactionUpdater />
        <MulticallUpdater />
        <ToastListener />
      </>
      <ResetCSS />
      <GlobalStyle />
      <Popups />
      <App />
    </Providers>
  </StrictMode>,
  document.getElementById('root')
)
