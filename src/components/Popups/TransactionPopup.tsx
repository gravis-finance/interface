import React, { useContext } from 'react'
import { PopupSuccessIcon, ErrorIcon } from '@gravis.finance/uikit'
import { useTranslation } from 'react-i18next'
import styled, { ThemeContext } from 'styled-components'
import useTranslateSummary from 'hooks/useTranslateSummary'
import { useActiveWeb3React } from '../../hooks'
import { TYPE, ExternalLink } from '../Shared'
import { getExplorerLink, getExplorerName } from '../../utils'
import { AutoColumn } from '../Column'
import { AutoRow } from '../Row'

const { body: Body } = TYPE

const RowNoFlex = styled(AutoRow)`
  flex-wrap: nowrap;
`

const StyledIcon = styled.div<{ removeAfterMs: number | null }>`
  > svg {
    > rect:last-child {
      stroke-dashoffset: 1000;
      stroke-dasharray: 166;
      animation: ${({ removeAfterMs }) => (removeAfterMs ? removeAfterMs + 100 : '')}ms linear 0s infinite
        strokeDashArrayMove;
    }

    @keyframes strokeDashArrayMove {
      0% {
        stroke-dasharray: 166;
      }
      100% {
        stroke-dasharray: 191;
      }
    }
  }
`

export default function TransactionPopup({
  hash,
  success,
  summary,
  removeAfterMs,
}: {
  hash: string
  success?: boolean
  summary?: string
  removeAfterMs: number | null
}) {
  const { chainId } = useActiveWeb3React()

  const theme = useContext(ThemeContext)

  const { t } = useTranslation()
  const translateSummary = useTranslateSummary()

  return (
    <RowNoFlex>
      <div style={{ paddingRight: 16 }}>
        {success ? (
          <StyledIcon removeAfterMs={removeAfterMs}>
            <PopupSuccessIcon color={theme.colors.success} width="48px" height="48px" />
          </StyledIcon>
        ) : (
          <StyledIcon removeAfterMs={removeAfterMs}>
            <ErrorIcon color={theme.colors.failure} width="48px" height="48px" />
          </StyledIcon>
        )}
      </div>
      <AutoColumn gap="8px">
        <Body fontWeight={500} style={{ fontWeight: 500 }}>
          {summary ? translateSummary(summary) : `${t('hash')}: ${hash.slice(0, 8)}...${hash.slice(58, 65)}`}
        </Body>
        {chainId && (
          <ExternalLink href={getExplorerLink(chainId, hash, 'transaction')}>
            {t(`${getExplorerName(chainId)}`)}
          </ExternalLink>
        )}
      </AutoColumn>
    </RowNoFlex>
  )
}
