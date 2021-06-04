import React, { useState, useCallback } from 'react'
import { Currency, Pair } from '@gravis.finance/sdk'
import { Button, Text, ArrowDropDownIcon, Flex } from '@gravis.finance/uikit'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { darken } from 'polished'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import CurrencyLogo from '../Logos/CurrencyLogo'
import DoubleCurrencyLogo from '../Logos/DoubleLogo'
import { RowBetween } from '../Row'
import { Input as NumericalInput } from '../NumericalInput'
import { useActiveWeb3React } from '../../hooks'
import { TranslateString } from '../../utils/translateTextHelpers'

const InputRow = styled.div<{ selected: boolean; customHeight?: number }>`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  padding: ${({ selected }) => (selected ? '0.4rem 0.5rem 0.4rem 1rem' : '0.4rem 0.75rem 0.4rem 1rem')};
  ${({ customHeight }) => (customHeight ? `height: ${customHeight}px;` : '')}
`

const CurrencySelect = styled.button<{ selected: boolean }>`
  align-items: center;
  height: 34px;
  font-size: 16px;
  font-weight: 500;
  background-color: transparent;
  color: ${({ selected, theme }) => (selected ? theme.colors.text : '#FFFFFF')};
  border-radius: 6px;
  outline: none;
  cursor: pointer;
  user-select: none;
  border: none;
  padding: 0 8px 0 10px;
  position: relative;
`

const LabelRow = styled.div`
  width: -webkit-fill-available;
  position: absolute;
  padding: 4px 0.75rem;
  top: -10px;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;

  & ${Text} {
    background: #414141;
    border-radius: 22px;
    padding: 0.5px 4px;
    line-height: 17px;
    font-size: 11px;
    line-height: 1rem;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.primaryBright};
  }

  span:hover {
    cursor: pointer;
    color: ${({ theme }) => darken(0.2, theme.colors.textSubtle)};
  }
`

const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const InputPanel = styled.div<{ hideInput?: boolean }>`
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  position: relative;
  border-radius: 6px;
  z-index: 1;
  background: linear-gradient(90.28deg, #292929 0%, #242424 100%);
  box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.4), -4px -4px 12px rgba(255, 255, 255, 0.05);
  border-radius: 40px;

  :focus-within {
    background: linear-gradient(90.28deg, #242424 0%, #1f1f1f 100%);
    box-shadow: inset 0px -1px 0px rgba(129, 129, 129, 0.15), inset 0px 4px 25px rgba(0, 0, 0, 0.25);
  }
`

const Container = styled.div<{ hideInput: boolean }>`
  border-radius: 6px;
  background-color: transparent;
  box-shadow: ${({ theme }) => theme.shadows.inset};
`

const StyledFlex = styled(Flex)`
  align-items: center;
  > div {
    transition: color 200ms ease-in-out;
  }
  > div > div {
    transition: color 200ms ease-in-out;
  }
  > svg * {
    transition: stroke 200ms ease-in-out, opacity 200ms ease-in-out;
  }
  :hover {
    > div {
      color: rgba(255, 255, 255, 0.8);
    }
    > div > div {
      color: rgba(255, 255, 255, 0.8);
    }
    > svg * {
      stroke: #fff;
      opacity: 0.8;
    }
  }
`

interface CurrencyInputPanelProps {
  value: string
  onUserInput: (value: string) => void
  onMax?: () => void
  showMaxButton: boolean
  label?: string
  onCurrencySelect?: (currency: Currency) => void
  currency?: Currency | null
  disableCurrencySelect?: boolean
  hideBalance?: boolean
  pair?: Pair | null
  hideInput?: boolean
  otherCurrency?: Currency | null
  id: string
  showCommonBases?: boolean
  currencyList?: any
  customHeight?: number
}

export default function CurrencyInputPanel({
  value,
  onUserInput,
  onMax,
  showMaxButton,
  label = TranslateString(132, 'Input'),
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  hideBalance = false,
  pair = null, // used for double token logo
  hideInput = false,
  otherCurrency,
  id,
  showCommonBases,
  currencyList,
  customHeight,
}: CurrencyInputPanelProps) {
  const { t } = useTranslation()

  const [modalOpen, setModalOpen] = useState(false)
  const { account } = useActiveWeb3React()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  return (
    <InputPanel>
      <Container hideInput={hideInput}>
        {!hideInput && (
          <LabelRow>
            <RowBetween>
              <Text fontSize="14px" style={!label ? { opacity: 0 } : { color: '#fff' }}>
                {label}
              </Text>
              {account && !hideBalance && !!currency && selectedCurrencyBalance && (
                <Text
                  onClick={onMax}
                  fontSize="14px"
                  style={{
                    display: 'inline',
                    cursor: 'pointer',
                    color: '#fff',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  {t('balanceTitle')}: {selectedCurrencyBalance?.toSignificant(6)}
                </Text>
              )}
            </RowBetween>
          </LabelRow>
        )}
        <InputRow
          style={hideInput ? { padding: '0', borderRadius: '8px' } : {}}
          selected={disableCurrencySelect}
          customHeight={customHeight}
        >
          {!hideInput && (
            <>
              <NumericalInput
                className="token-amount-input"
                value={value}
                onUserInput={(val) => {
                  onUserInput(val)
                }}
                style={{ fontSize: '14px' }}
                data-id={id}
              />
              {account && currency && showMaxButton && label !== 'To' && (
                <Button onClick={onMax} size="sm" variant="text" buttonType="max" data-id={`${id}-max-button`}>
                  {t('maxAmountLabel')}
                </Button>
              )}
            </>
          )}
          <CurrencySelect
            selected={!!currency}
            data-id={`${id}-button`}
            onClick={() => {
              if (!disableCurrencySelect) {
                setModalOpen(true)
              }
            }}
          >
            <Aligner>
              {pair ? (
                <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={24} margin />
              ) : currency ? (
                <CurrencyLogo currency={currency} size="24px" style={{ marginRight: '8px' }} />
              ) : null}
              {pair ? (
                <Text color="rgba(255, 255, 255, 0.5)" style={{ marginLeft: '8px', fontSize: '14px' }}>
                  {pair?.token0.symbol}:{pair?.token1.symbol}
                </Text>
              ) : (
                <StyledFlex>
                  <Text color="rgba(255, 255, 255, 0.5)" style={{ paddingRight: '12px', fontSize: '14px' }}>
                    {(currency && currency.symbol && currency.symbol.length > 20
                      ? `${currency.symbol.slice(0, 4)}...${currency.symbol.slice(
                          currency.symbol.length - 5,
                          currency.symbol.length
                        )}`
                      : currency?.symbol) || (
                      <Text color="rgba(255, 255, 255, 0.5)" style={{ fontSize: '14px' }}>
                        {t('selectToken')}
                      </Text>
                    )}
                  </Text>
                  {!disableCurrencySelect && <ArrowDropDownIcon />}
                </StyledFlex>
              )}
            </Aligner>
          </CurrencySelect>
        </InputRow>
      </Container>
      {!disableCurrencySelect && onCurrencySelect && (
        <CurrencySearchModal
          isOpen={modalOpen}
          onDismiss={handleDismissSearch}
          onCurrencySelect={onCurrencySelect}
          selectedCurrency={currency}
          otherSelectedCurrency={otherCurrency}
          showCommonBases={showCommonBases}
          currencyList={currencyList}
        />
      )}
    </InputPanel>
  )
}
