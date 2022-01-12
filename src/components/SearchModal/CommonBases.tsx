import React from 'react'
import { Text } from '@gravis.finance/uikit'

import { ChainId, Currency, currencyEquals, BASE_CURRENCIES, Token } from '@gravis.finance/sdk'
import styled from 'styled-components'

import useNetwork from 'hooks/useNetwork'
import { SUGGESTED_BASES } from '../../constants'
import { AutoColumn } from '../Column'
import QuestionHelper from '../QuestionHelper'
import { AutoRow } from '../Row'
import CurrencyLogo from '../Logos/CurrencyLogo'

const BaseWrapper = styled.div<{ disable?: boolean }>`
  border: 1px solid ${({ disable }) => (disable ? 'transparent' : 'rgba(255, 255, 255, 0.05)')};
  border-radius: 10px;
  display: flex;
  padding: 6px 8px 6px 6px;
  transition: background-color 200ms ease-in-out;

  align-items: center;

  :hover {
    cursor: ${({ disable }) => (!disable ? 'pointer' : 'default')};
    background-color: ${({ disable }) => !disable && '#393939'};
  }

  background-color: ${({ theme, disable }) => disable && theme.colors.primary};
  opacity: ${({ disable }) => disable && '0.4'};
`

const StyledAutoColumn = styled(AutoColumn)`
  margin: 0 24px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 8px;
`

export default function CommonBases({
  chainId,
  onSelect,
  selectedCurrency,
}: {
  chainId?: ChainId
  selectedCurrency?: Currency | null
  onSelect: (currency: Currency) => void
}) {
  const { network } = useNetwork()
  const ETHER = BASE_CURRENCIES[network]

  return (
    <StyledAutoColumn gap="md">
      <AutoRow>
        <Text fontSize="14px">Common bases</Text>
        <QuestionHelper text="These tokens are commonly paired with other tokens." />
      </AutoRow>
      <AutoRow gap="4px" justifyContent="center">
        <BaseWrapper
          onClick={() => {
            if (!selectedCurrency || !currencyEquals(selectedCurrency, ETHER)) {
              onSelect(ETHER)
            }
          }}
          disable={selectedCurrency === ETHER}
        >
          <CurrencyLogo currency={ETHER} style={{ marginRight: 8 }} />
          <Text>{ETHER.symbol}</Text>
        </BaseWrapper>
        {(chainId ? SUGGESTED_BASES[chainId] : []).map((token: Token) => {
          const selected = selectedCurrency instanceof Token && selectedCurrency.address === token.address
          return (
            <BaseWrapper onClick={() => !selected && onSelect(token)} disable={selected} key={token.address}>
              <CurrencyLogo currency={token} style={{ marginRight: 8 }} />
              <Text>{token.symbol}</Text>
            </BaseWrapper>
          )
        })}
      </AutoRow>
    </StyledAutoColumn>
  )
}
