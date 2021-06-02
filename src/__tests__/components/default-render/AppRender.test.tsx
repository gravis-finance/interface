import App from 'pages/App'
import ReactDOM from 'react-dom'
import Providers from 'Providers'
import { ethers } from 'ethers'
import React from 'react'
import ListsUpdater from 'state/lists/updater'
import ApplicationUpdater from 'state/application/updater'
import TransactionUpdater from 'state/transactions/updater'
import MulticallUpdater from 'state/multicall/updater'
import ToastListener from 'components/ToastListener'
import GlobalStyle from 'style/Global'

describe('default render of App', () => {
  it('renders without crashing', () => {
    const provider = new ethers.providers.JsonRpcProvider()
    window.ethereum = provider
    const div = document.createElement('div')
    ReactDOM.render(
      <Providers>
        <>
          <ListsUpdater />
          <ApplicationUpdater />
          <TransactionUpdater />
          <MulticallUpdater />
          <ToastListener />
        </>
        <GlobalStyle />
        <App />
      </Providers>,
      div
    )
    ReactDOM.unmountComponentAtNode(div)
  })
})
