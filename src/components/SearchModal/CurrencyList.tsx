import { Currency, CurrencyAmount, currencyEquals, isEther, BASE_CURRENCIES, Token } from '@gravis.finance/sdk'
import React, { CSSProperties, MouseEventHandler, MutableRefObject, useCallback, useMemo } from 'react'
import { FixedSizeList } from 'react-window'
import styled from 'styled-components'
import { Text, AddIcon, ButtonBase, Tooltip } from '@gravis.finance/uikit'
import { useTranslation } from 'react-i18next'
import useNetwork from 'hooks/useNetwork'
import { useActiveWeb3React } from '../../hooks'
import { useSelectedTokenList, WrappedTokenInfo } from '../../state/lists/hooks'
import { useRemoveUserAddedToken } from '../../state/user/hooks'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import { LinkStyledButton, TYPE } from '../Shared'
import { useIsUserAddedToken } from '../../hooks/Tokens'
import Column from '../Column'
import { RowFixed } from '../Row'
import CurrencyLogo from '../Logos/CurrencyLogo'
import { MouseoverTooltip } from '../Tooltip'
import { FadedSpan, MenuItem } from './styleds'
import Loader from '../Loader'
import { isTokenOnList } from '../../utils'
import { registerToken } from '../../utils/wallet'
import useCurrencyImageSrcs from '../../hooks/useCurrencyImageSrcs'

const { main: Main } = TYPE

function currencyKey(currency: Currency): string {
  return currency instanceof Token ? currency.address : isEther(currency) ? 'ETHER' : ''
}

const StyledBalanceText = styled(Text)`
  white-space: nowrap;
  overflow: hidden;
  max-width: 5rem;
  text-overflow: ellipsis;
`

const Tag = styled.div`
  background-color: ${({ theme }) => theme.colors.tertiary};
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 14px;
  border-radius: 4px;
  padding: 0.25rem 0.3rem 0.25rem 0.3rem;
  max-width: 6rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  justify-self: flex-end;
  margin-right: 4px;
`

const AddButton = styled(ButtonBase)`
  svg {
    width: 16px;
    height: 16px;
    fill: currentColor;
  }
`
AddButton.defaultProps = { children: <AddIcon /> }

function Balance({ balance }: { balance: CurrencyAmount }) {
  return <StyledBalanceText title={balance.toExact()}>{balance.toSignificant(4)}</StyledBalanceText>
}

const TagContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`

function TokenTags({ currency }: { currency: Currency }) {
  if (!(currency instanceof WrappedTokenInfo)) {
    return <span />
  }

  const { tags } = currency
  if (!tags || tags.length === 0) return <span />

  const tag = tags[0]

  return (
    <TagContainer>
      <MouseoverTooltip text={tag.description}>
        <Tag key={tag.id}>{tag.name}</Tag>
      </MouseoverTooltip>
      {tags.length > 1 ? (
        <MouseoverTooltip
          text={tags
            .slice(1)
            .map(({ name, description }) => `${name}: ${description}`)
            .join('; \n')}
        >
          <Tag>...</Tag>
        </MouseoverTooltip>
      ) : null}
    </TagContainer>
  )
}

const HotContainer = styled.div`
  height: auto;
  padding: 0px 4px;
  color: white;
  align-items: center;
  background-color: transparent;
  border: 2px solid rgb(235, 149, 0);
  border-radius: 16px;
  display: inline-flex;
  font-size: 11px;
  font-weight: 400;
  height: 22px;
  line-height: 1.5;
  padding: 0px 8px;
  white-space: nowrap;
  margin-left: 8px;
  position: relative;
  overflow: hidden;
  
  :after {
    content: '';
    position: absolute;
    left: -12px;
    top: -1px;
    width: 10px;
    height: 22px;
    background: rgba(255, 255, 255, 0.5);
    transform: skew(-30deg);
    animation: shine-hot 2s ease-in-out infinite;
  }
  
  @keyframes shine-hot {
    0% {
      left: -12px;
    }
    50% {
      left: 100%;
    }
    100% {
      left: 100%;
    }
  }
`

function CurrencyRow({
  currency,
  onSelect,
  isSelected,
  otherSelected,
  style,
}: {
  currency: Currency
  onSelect: () => void
  isSelected: boolean
  otherSelected: boolean
  style: CSSProperties
}) {
  const { account, chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const selectedTokenList = useSelectedTokenList()
  const isOnSelectedList = isTokenOnList(selectedTokenList, currency)
  const customAdded = useIsUserAddedToken(currency)
  const balance = useCurrencyBalance(account ?? undefined, currency)
  const isWrappedCurrency = currency instanceof WrappedTokenInfo
  const removeToken = useRemoveUserAddedToken()
  const logoSrcs = useCurrencyImageSrcs(currency)

  const onAddCurrencyToMetamask: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation()
    const tokenInfo = currency as WrappedTokenInfo
    if (tokenInfo.symbol) {
      registerToken(tokenInfo.address, tokenInfo.symbol, tokenInfo.decimals, logoSrcs[0] || '')
    }
  }

  // only show add or remove buttons if not on selected list
  return (
    <MenuItem
      style={style}
      onClick={() => (isSelected ? null : onSelect())}
      disabled={isSelected}
      selected={otherSelected}
      data-id={`token-item-${currency.symbol}`}
    >
      <CurrencyLogo currency={currency} size="24px" />
      <Column>
        <Text style={{ display: 'flex', alignItems: 'center' }}>
          <span title={currency.name}>{currency.symbol} </span>
          {!isOnSelectedList && customAdded && !isWrappedCurrency ? (
            <Main fontWeight={500}>
              <LinkStyledButton
                onClick={(event) => {
                  event.stopPropagation()
                  if (chainId && currency instanceof Token) removeToken(chainId.toString(), currency.address)
                }}
              >
                ({t('remove')})
              </LinkStyledButton>
            </Main>
          ) : null}
          {isWrappedCurrency && !window.location.pathname.includes('migrate') && (
            <Tooltip placement="right" title={t('addToMetamask')}>
              <AddButton ml={2} onClick={onAddCurrencyToMetamask} />
            </Tooltip>
          )}
          {currency.symbol === "GRVX" &&
            <HotContainer>
              HOT
            </HotContainer>
          }
        </Text>
        <FadedSpan>
          {/* {!isOnSelectedList && !customAdded && !(currency instanceof WrappedTokenInfo) ? (
            <Main fontWeight={500}>
              Found by address
              <LinkStyledButton
                onClick={(event) => {
                  event.stopPropagation()
                  if (currency instanceof Token) addToken(tempCurrency)
                }}
              >
                (Add)
              </LinkStyledButton>
            </Main>
           ) : null} */}
        </FadedSpan>
      </Column>
      <TokenTags currency={currency} />
      <RowFixed style={{ justifySelf: 'flex-end' }}>
        {balance ? <Balance balance={balance} /> : account ? <Loader /> : null}
      </RowFixed>
    </MenuItem>
  )
}

export default function CurrencyList({
  height,
  currencies,
  selectedCurrency,
  onCurrencySelect,
  otherCurrency,
  fixedListRef,
  showETH,
}: {
  height: number
  currencies: Currency[]
  selectedCurrency?: Currency | null
  onCurrencySelect: (currency: Currency) => void
  otherCurrency?: Currency | null
  fixedListRef?: MutableRefObject<FixedSizeList | undefined>
  showETH: boolean
}) {
  const { network } = useNetwork()
  const itemData = useMemo(
    () => (showETH ? [BASE_CURRENCIES[network], ...currencies] : [...currencies]),
    [currencies, showETH, network]
  )

  const Row = useCallback(
    ({ data, index, style }) => {
      const currency: Currency = data[index]
      const isSelected = Boolean(selectedCurrency && currencyEquals(selectedCurrency, currency))
      const otherSelected = Boolean(otherCurrency && currencyEquals(otherCurrency, currency))
      const handleSelect = () => onCurrencySelect(currency)
      return (
        <CurrencyRow
          style={style}
          currency={currency}
          isSelected={isSelected}
          onSelect={handleSelect}
          otherSelected={otherSelected}
        />
      )
    },
    [onCurrencySelect, otherCurrency, selectedCurrency]
  )

  const itemKey = useCallback((index: number, data: any) => currencyKey(data[index]), [])

  return (
    <FixedSizeList
      height={height}
      ref={fixedListRef as any}
      width="100%"
      itemData={itemData}
      itemCount={itemData.length}
      itemSize={56}
      itemKey={itemKey}
    >
      {Row}
    </FixedSizeList>
  )
}
