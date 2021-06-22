import App from 'pages/App'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import Providers from 'Providers'
import { ethers } from 'ethers'
import React from 'react'
import Updaters from 'Updaters'
import GlobalStyle from 'style/Global'

describe('default render of App', () => {
  it('renders without crashing', () => {
    const provider = new ethers.providers.JsonRpcProvider()
    window.ethereum = provider
    const div = document.createElement('div')
    ReactDOM.render(
      <Router>
        <Providers>
          <Updaters />
          <GlobalStyle />
          <App />
        </Providers>
      </Router>,
      div
    )
    ReactDOM.unmountComponentAtNode(div)
  })
})
