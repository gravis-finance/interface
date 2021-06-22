import { Currency, BASE_CURRENCIES, JSBI, TokenAmount, ChainId } from '@gravis.finance/sdk'
import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Button, ChevronDownIcon, CardBody, Text, BorderedAddIcon } from '@gravis.finance/uikit'
import { useTranslation } from 'react-i18next'
import CardNav from 'components/CardNav'
import Card from 'components/Card'
import { AutoColumn, ColumnCenter } from 'components/Column'
import CurrencyLogo from 'components/Logos/CurrencyLogo'
import { FindPoolTabs } from 'components/NavigationTabs'
import { MinimalPositionCard } from 'components/PositionCard'
import CurrencySearchModal from 'components/SearchModal/CurrencySearchModal'
import { PairState, usePair } from 'data/Reserves'
import { useActiveWeb3React } from 'hooks'
import { usePairAdder } from 'state/user/hooks'
import { useTokenBalance } from 'state/wallet/hooks'
import { StyledInternalLink } from 'components/Shared'
import { currencyId } from 'utils/currencyId'
import AppBody from '../AppBody'
import { Dots } from '../Pool/styleds'

enum Fields {
  TOKEN0 = 0,
  TOKEN1 = 1,
}

const StyledAddIcon = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 6px;
  display: flex;

  > * {
    margin: auto;
  }
`

export default function PoolFinder() {
  const { account, chainId } = useActiveWeb3React()

  const [showSearch, setShowSearch] = useState<boolean>(false)
  const [activeField, setActiveField] = useState<number>(Fields.TOKEN1)

  const [currency0, setCurrency0] = useState<Currency | null>(BASE_CURRENCIES[chainId as ChainId])
  const [currency1, setCurrency1] = useState<Currency | null>(null)
  const { t } = useTranslation()

  const [pairState, pair] = usePair(currency0 ?? undefined, currency1 ?? undefined)
  const addPair = usePairAdder()
  useEffect(() => {
    if (pair) {
      addPair(pair)
    }
  }, [pair, addPair])

  const validPairNoLiquidity: boolean =
    pairState === PairState.NOT_EXISTS ||
    Boolean(
      pairState === PairState.EXISTS &&
        pair &&
        JSBI.equal(pair.reserve0.raw, JSBI.BigInt(0)) &&
        JSBI.equal(pair.reserve1.raw, JSBI.BigInt(0))
    )

  const position: TokenAmount | undefined = useTokenBalance(account ?? undefined, pair?.liquidityToken)
  const hasPosition = Boolean(position && JSBI.greaterThan(position.raw, JSBI.BigInt(0)))

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      if (activeField === Fields.TOKEN0) {
        setCurrency0(currency)
      } else {
        setCurrency1(currency)
      }
    },
    [activeField]
  )

  const handleSearchDismiss = useCallback(() => {
    setShowSearch(false)
  }, [setShowSearch])

  const prerequisiteMessage = (
    <Card padding="10px 10px">
      <Text style={{ textAlign: 'center' }}>{!account ? t('connectToFindPools') : t('selectToFindLiquidity')}</Text>
    </Card>
  )

  return (
    <>
      <CardNav activeIndex={1} />
      <AppBody>
        <FindPoolTabs />
        <CardBody>
          <AutoColumn gap="md">
            <Button
              onClick={() => {
                setShowSearch(true)
                setActiveField(Fields.TOKEN0)
              }}
              startIcon={currency0 ? <CurrencyLogo currency={currency0} style={{ marginRight: '.5rem' }} /> : null}
              endIcon={<ChevronDownIcon width="24px" color="white" />}
              fullwidth
              variant="dark"
              data-id="first-token-pool-selector"
            >
              {currency0 ? currency0.symbol : t('selectToken')}
            </Button>

            <ColumnCenter>
              <StyledAddIcon>
                <BorderedAddIcon />
              </StyledAddIcon>
            </ColumnCenter>

            <Button
              onClick={() => {
                setShowSearch(true)
                setActiveField(Fields.TOKEN1)
              }}
              startIcon={currency1 ? <CurrencyLogo currency={currency1} style={{ marginRight: '.5rem' }} /> : null}
              endIcon={<ChevronDownIcon width="24px" color="white" />}
              fullwidth
              variant="dark"
              data-id="second-token-pool-selector"
            >
              {currency1 ? currency1.symbol : t('selectToken')}
            </Button>

            {hasPosition && (
              <ColumnCenter
                style={{ justifyItems: 'center', backgroundColor: '', padding: '12px 0px', borderRadius: '12px' }}
              >
                <Text style={{ textAlign: 'center' }}>{t('poolFound')}</Text>
              </ColumnCenter>
            )}

            {currency0 && currency1 ? (
              pairState === PairState.EXISTS ? (
                hasPosition && pair ? (
                  <MinimalPositionCard pair={pair} />
                ) : (
                  <Card padding="30px 10px 10px 10px">
                    <AutoColumn gap="sm" justify="center">
                      <Text style={{ textAlign: 'center' }}>{t('noLiquidityInPool')}</Text>
                      <StyledInternalLink to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}>
                        <Button>{t('addLiquidity')}</Button>
                      </StyledInternalLink>
                    </AutoColumn>
                  </Card>
                )
              ) : validPairNoLiquidity ? (
                <Card padding="30px 10px">
                  <AutoColumn gap="sm" justify="center">
                    <Text style={{ textAlign: 'center' }}>{t('noPool')}</Text>
                    <StyledInternalLink to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}>
                      {t('createPool')}
                    </StyledInternalLink>
                  </AutoColumn>
                </Card>
              ) : pairState === PairState.INVALID ? (
                <Card padding="30px 10px">
                  <AutoColumn gap="sm" justify="center">
                    <Text style={{ textAlign: 'center' }}>{t('invalidPair')}</Text>
                  </AutoColumn>
                </Card>
              ) : pairState === PairState.LOADING ? (
                <Card padding="30px 10px">
                  <AutoColumn gap="sm" justify="center">
                    <Text style={{ textAlign: 'center' }}>
                      {t('loading')}
                      <Dots />
                    </Text>
                  </AutoColumn>
                </Card>
              ) : null
            ) : (
              prerequisiteMessage
            )}
          </AutoColumn>

          <CurrencySearchModal
            isOpen={showSearch}
            onCurrencySelect={handleCurrencySelect}
            onDismiss={handleSearchDismiss}
            showCommonBases
            selectedCurrency={(activeField === Fields.TOKEN0 ? currency1 : currency0) ?? undefined}
          />
        </CardBody>
      </AppBody>
    </>
  )
}
