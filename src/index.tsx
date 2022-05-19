import { ResetCSS } from '@gravis.finance/uikit'
import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'

import Providers from './Providers'
import Updaters from './Updaters'
import Popups from './components/Popups'
import './i18n'
import App from './pages/App'
import GlobalStyle from './style/Global'

if ('ethereum' in window) {
  window.ethereum.autoRefreshOnNetworkChange = false
}

window.addEventListener('error', () => {
  localStorage?.removeItem('redux_localstorage_simple_lists')
})

if (process.env.REACT_APP_NODE_ENV === 'production') {
  import('@sentry/react').then(({ init }) => {
    init({
      dsn: 'https://e1bac36e1d5f4293af21e0b36b3b2728@sentry.gravis.finance/2'
    })
  })
}

ReactDOM.render(
  <Router>
    <StrictMode>
      <Providers>
        <Updaters />
        <ResetCSS />
        <GlobalStyle />
        <Popups />
        <App />
      </Providers>
    </StrictMode>
  </Router>,
  document.getElementById('root')
)
