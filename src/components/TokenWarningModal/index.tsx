import { Token } from '@gravis.finance/sdk'
import { transparentize } from 'polished'
import { Button, Text } from '@gravis.finance/uikit'
import { useTranslation } from 'react-i18next'
import React, { useCallback, useMemo, useState, lazy } from 'react'
import styled from 'styled-components'
import { AlertTriangle } from 'react-feather'
import { useActiveWeb3React } from '../../hooks'
import { useAllTokens } from '../../hooks/Tokens'
import { ExternalLink, TYPE } from '../Shared'
import { getExplorerLink, getExplorerName, shortenAddress } from '../../utils'
import CurrencyLogo from '../Logos/CurrencyLogo'
import { AutoRow, RowBetween } from '../Row'
import { AutoColumn } from '../Column'

const Modal = lazy(() => import('../Modal'))
const { main: Main } = TYPE

const Wrapper = styled.div<{ error: boolean }>`
  // background: ${({ theme }) => transparentize(0.6, theme.colors.tertiary)};
  padding: 10px 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-sizing: border-box;
  border-radius: 6px;
`

const WarningContainer = styled.div`
  width: 100%;
  padding: 1rem;
  background: rgba(242, 150, 2, 0.05);
  border: 1px solid #f3841e;
  border-radius: 20px;
  overflow: auto;
`

const StyledWarningIcon = styled(AlertTriangle)`
  stroke: ${({ theme }) => theme.colors.failure};
`

const StyledExternalLink = styled(ExternalLink)`
  color: white;
  text-decoration: none;
  transition: color 200ms ease-in-out;

  :hover {
    color: rgb(0, 156, 225);
    text-decoration: none;
  }
`

interface TokenWarningCardProps {
  token?: Token
}

function TokenWarningCard({ token }: TokenWarningCardProps) {
  const { chainId } = useActiveWeb3React()

  const tokenSymbol = token?.symbol?.toLowerCase() ?? ''
  const tokenName = token?.name?.toLowerCase() ?? ''

  const allTokens = useAllTokens()

  const { t } = useTranslation()

  const duplicateNameOrSymbol = useMemo(() => {
    if (!token || !chainId) return false

    return Object.keys(allTokens).some((tokenAddress) => {
      const userToken = allTokens[tokenAddress]
      if (userToken.equals(token)) {
        return false
      }
      return userToken.symbol?.toLowerCase() === tokenSymbol || userToken.name?.toLowerCase() === tokenName
    })
  }, [token, chainId, allTokens, tokenSymbol, tokenName])

  if (!token) return null

  return (
    <Wrapper error={duplicateNameOrSymbol}>
      <AutoRow gap="6px">
        <AutoColumn gap="24px">
          <CurrencyLogo currency={token} size="16px" />
          <div> </div>
        </AutoColumn>
        <AutoColumn gap="10px" justify="flex-start">
          <Main>
            {token && token.name && token.symbol && token.name !== token.symbol
              ? `${token.name} (${token.symbol})`
              : token.name || token.symbol}{' '}
          </Main>
          {chainId && (
            <StyledExternalLink style={{ fontWeight: 400 }} href={getExplorerLink(chainId, token.address, 'token')}>
              {shortenAddress(token.address)} ({t(`${getExplorerName(chainId)}`)})
            </StyledExternalLink>
          )}
        </AutoColumn>
      </AutoRow>
    </Wrapper>
  )
}

export default function TokenWarningModal({
  isOpen,
  tokens,
  onConfirm,
}: {
  isOpen: boolean
  tokens: Token[]
  onConfirm: () => void
}) {
  const [understandChecked, setUnderstandChecked] = useState(false)
  const toggleUnderstand = useCallback(() => setUnderstandChecked((uc) => !uc), [])
  const { t } = useTranslation()

  const handleDismiss = useCallback(() => null, [])
  return (
    <Modal isOpen={isOpen} onDismiss={handleDismiss} maxHeight={90} istransparent>
      <WarningContainer className="token-warning-container">
        <AutoColumn gap="lg">
          <AutoRow gap="6px">
            <StyledWarningIcon />
            <Text color="failure">{t('tokenImported')}</Text>
          </AutoRow>
          <Text>{t('errorMessages.importTokenWarning')}</Text>
          <Text>
            {t('errorMessages.importTokenWarningPurchase')}
            <strong>{t('errorMessages.youMaybeUnable')}</strong>
          </Text>
          {tokens.map((token) => {
            return <TokenWarningCard key={token.address} token={token} />
          })}
          <RowBetween>
            <div>
              <label htmlFor="understand-checkbox" style={{ cursor: 'pointer', userSelect: 'none' }}>
                <input
                  id="understand-checkbox"
                  type="checkbox"
                  className="understand-checkbox"
                  checked={understandChecked}
                  onChange={toggleUnderstand}
                />{' '}
                <Text as="span" ml="4px">
                  {t('iUnderstand')}
                </Text>
              </label>
            </div>
            <Button
              disabled={!understandChecked}
              variant="danger"
              style={{ width: '140px' }}
              className="token-dismiss-button"
              data-id="token-warning-continue-button"
              onClick={() => {
                onConfirm()
              }}
            >
              {t('continue')}
            </Button>
          </RowBetween>
        </AutoColumn>
      </WarningContainer>
    </Modal>
  )
}
