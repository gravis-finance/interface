import React from 'react'
import { Button, ButtonProps, useWalletModal } from '@gravis.finance/uikit'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import useAuth from 'hooks/useAuth'

const StyledButtonUnlockWallet = styled.div`
  > button {
    width: 151px;
    margin-top: 10px;
  }
  @media screen and (max-width: 376px) {
    > button {
      width: 100%;
    }
  }
`

const UnlockButton: React.FC<ButtonProps> = (props) => {
  const { t } = useTranslation()
  const { login, logout } = useAuth()
  const { onPresentConnectModal } = useWalletModal(process.env.REACT_APP_NODE_ENV === 'production', login, logout)

  return (
    <StyledButtonUnlockWallet>
      <Button onClick={onPresentConnectModal} data-id="unlock-wallet-button" {...props}>
        {t('unlockWallet')}
      </Button>
    </StyledButtonUnlockWallet>
  )
}

export default UnlockButton
