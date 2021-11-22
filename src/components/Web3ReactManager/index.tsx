import React, { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { Spinner } from '@gravis.finance/uikit'

import useNetwork from '../../hooks/useNetwork'
import useEagerConnect, { useInactiveListener } from '../../hooks'

const MessageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20rem;
`

const Message = styled.h2`
  color: ${({ theme }) => theme.colors.primaryDark};
`

export default function Web3ReactManager({ children }: { children: JSX.Element }) {
  const { t } = useTranslation()
  const { active } = useWeb3React()
  const { network, networkConnectors, networkContextName } = useNetwork()
  const { active: networkActive, error: networkError, activate: activateNetwork } = useWeb3React(networkContextName)

  // try to eagerly connect to an injected provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  // after eagerly trying injected, if the network connect ever isn't active or in an error state, activate itd
  useEffect(() => {
    if (triedEager && !networkError && networkConnectors[network]) {
      activateNetwork(networkConnectors[network])
    }
  }, [triedEager, networkActive, networkError, activateNetwork, active, networkConnectors, network])

  // when there's no account connected, react to logins (broadly speaking) on the injected provider, if it exists
  useInactiveListener(!triedEager)

  // handle delayed loader state
  const [showLoader, setShowLoader] = useState(false)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLoader(true)
    }, 600)

    return () => {
      clearTimeout(timeout)
    }
  }, [])

  // on page load, do nothing until we've tried to connect to the injected connector
  if (!triedEager) {
    return null
  }

  // if the account context isn't active, and there's an error on the network context, it's an irrecoverable error
  if (!active && networkError) {
    return (
      <MessageWrapper>
        <Message>{t('unknownError')}</Message>
      </MessageWrapper>
    )
  }

  // if neither context is active, spin
  if (!active && !networkActive) {
    return showLoader ? (
      <MessageWrapper>
        <Spinner size={30} />
      </MessageWrapper>
    ) : null
  }

  return children
}
