import { ChainId, JSBI, Pair, Percent } from '@gravis.finance/sdk'
import {
  AddIcon,
  ArrowDropDownIcon,
  ArrowDropUpIcon,
  Button,
  ButtonBase,
  CardBody,
  ColoredCopyIcon,
  IconButton,
  Text,
  Tooltip,
  Card as UIKitCard
} from '@gravis.finance/uikit'
import { darken } from 'polished'
import React, { MouseEventHandler, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { useTotalSupply } from '../../data/TotalSupply'
import { useActiveWeb3React } from '../../hooks'
import { useTokenBalance } from '../../state/wallet/hooks'
import { currencyId } from '../../utils/currencyId'
import { registerToken } from '../../utils/wallet'
import { unwrappedToken } from '../../utils/wrappedCurrency'
import Card from '../Card'
import { AutoColumn } from '../Column'
import CurrencyLogo from '../Logos/CurrencyLogo'
import DoubleCurrencyLogo from '../Logos/DoubleLogo'
import { RowBetween, RowFixed } from '../Row'
import { Dots } from '../swap/styleds'

interface FixedHeightProps {
  background?: boolean
}

export const FixedHeightRow = styled(RowBetween)`
  height: 36px;
  ${(props: FixedHeightProps) =>
    props.background &&
    `
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.05) !important;
  `}
`

export const HoverCard = styled(Card)`
  border: 1px solid ${({ theme }) => theme.colors.invertedContrast};
  :hover {
    border: 1px solid
      ${({ theme }) => darken(0.06, theme.colors.invertedContrast)};
  }
`

const CopyButtonWrapper = styled(IconButton)`
  width: 30px;
  height: 30px;
`

const StyledUIKitCard = styled(UIKitCard)`
  border-radius: 6px;
  max-width: 738px;
  background: #292929;

  @media screen and (max-width: 1024px) {
    max-width: inherit;
  }
`

const StyledCardBody = styled(CardBody)`
  padding: 24px;
`

const AddButton = styled(ButtonBase)`
  svg {
    width: 18px;
    height: 18px;
    fill: currentColor;

    * {
      transition: fill 200ms ease-in-out;
    }

    :hover {
      * {
        fill: rgba(255, 255, 255, 0.7);
      }
    }
  }
`
AddButton.defaultProps = { children: <AddIcon /> }

interface PositionCardProps {
  pair: Pair
  // eslint-disable-next-line react/no-unused-prop-types
  showUnwrapped?: boolean
}

export function MinimalPositionCard({
  pair,
  showUnwrapped = false
}: PositionCardProps) {
  const { account, chainId } = useActiveWeb3React()
  const { t } = useTranslation()

  const currency0 = showUnwrapped
    ? pair.token0
    : unwrappedToken(pair.token0, chainId as ChainId)
  const currency1 = showUnwrapped
    ? pair.token1
    : unwrappedToken(pair.token1, chainId as ChainId)

  const [showMore, setShowMore] = useState(false)

  const userPoolBalance = useTokenBalance(
    account ?? undefined,
    pair.liquidityToken
  )
  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
          pair.getLiquidityValue(
            pair.token0,
            totalPoolTokens,
            userPoolBalance,
            false
          ),
          pair.getLiquidityValue(
            pair.token1,
            totalPoolTokens,
            userPoolBalance,
            false
          )
        ]
      : [undefined, undefined]

  return (
    <>
      {userPoolBalance && (
        <StyledUIKitCard>
          <StyledCardBody>
            <AutoColumn>
              <FixedHeightRow>
                <RowFixed>
                  <Text
                    style={{ textTransform: 'uppercase', fontWeight: 600 }}
                    fontSize="14px"
                    color="textSubtle"
                  >
                    {t('lpTokensInWallet')}
                  </Text>
                </RowFixed>
              </FixedHeightRow>
              <FixedHeightRow
                onClick={() => setShowMore(!showMore)}
                style={{ paddingRight: '16px', paddingLeft: '16px' }}
              >
                <RowFixed>
                  <DoubleCurrencyLogo
                    currency0={currency0}
                    currency1={currency1}
                    margin
                    size={20}
                  />
                  <Text
                    fontSize="14px"
                    color="#909090"
                    pl="8px"
                    style={{ fontWeight: 500 }}
                  >
                    {currency0.symbol}/{currency1.symbol}
                  </Text>
                </RowFixed>
                <RowFixed>
                  <Text
                    fontSize="14px"
                    style={{ fontWeight: 500 }}
                    color="#909090"
                  >
                    {userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}
                  </Text>
                </RowFixed>
              </FixedHeightRow>
              <AutoColumn gap="4px">
                <FixedHeightRow
                  style={{
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '6px',
                    paddingRight: '16px',
                    paddingLeft: '16px'
                  }}
                >
                  <Text
                    fontSize="14px"
                    color="#909090"
                    style={{ fontWeight: 500 }}
                  >
                    {currency0.symbol}:
                  </Text>
                  {token0Deposited ? (
                    <RowFixed>
                      <Text
                        ml="6px"
                        fontSize="14px"
                        style={{ fontWeight: 500 }}
                        color="#009CE1"
                      >
                        {token0Deposited?.toSignificant(6)}
                      </Text>
                    </RowFixed>
                  ) : (
                    '-'
                  )}
                </FixedHeightRow>
                <FixedHeightRow
                  style={{ paddingRight: '16px', paddingLeft: '16px' }}
                >
                  <Text
                    fontSize="14px"
                    color="#909090"
                    style={{ fontWeight: 500 }}
                  >
                    {currency1.symbol}:
                  </Text>
                  {token1Deposited ? (
                    <RowFixed>
                      <Text
                        ml="6px"
                        fontSize="14px"
                        style={{ fontWeight: 500 }}
                        color="#909090"
                      >
                        {token1Deposited?.toSignificant(6)}
                      </Text>
                    </RowFixed>
                  ) : (
                    '-'
                  )}
                </FixedHeightRow>
              </AutoColumn>
            </AutoColumn>
          </StyledCardBody>
        </StyledUIKitCard>
      )}
    </>
  )
}

export default function FullPositionCard({ pair }: PositionCardProps) {
  const { account, chainId, library } = useActiveWeb3React()

  const currency0 = unwrappedToken(pair.token0, chainId as ChainId)
  const currency1 = unwrappedToken(pair.token1, chainId as ChainId)
  const { t } = useTranslation()

  const liquidityAddress = pair.liquidityToken.address

  const [showMore, setShowMore] = useState(false)

  const userPoolBalance = useTokenBalance(
    account ?? undefined,
    pair.liquidityToken
  )
  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  const poolTokenPercentage =
    !!userPoolBalance &&
    !!totalPoolTokens &&
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
      : undefined

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
          pair.getLiquidityValue(
            pair.token0,
            totalPoolTokens,
            userPoolBalance,
            false
          ),
          pair.getLiquidityValue(
            pair.token1,
            totalPoolTokens,
            userPoolBalance,
            false
          )
        ]
      : [undefined, undefined]

  const handleAddressCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
    navigator.clipboard.writeText(liquidityAddress)
    e.stopPropagation()
  }

  const onAddCurrencyToMetamask: MouseEventHandler<HTMLButtonElement> = (
    event
  ) => {
    event.stopPropagation()
    const { liquidityToken } = pair
    if (liquidityToken.symbol) {
      registerToken(
        liquidityToken.address,
        'GravisLP',
        liquidityToken.decimals,
        ''
      )
    }
  }

  const isMetamask = useMemo(
    () => library?.connection?.url === 'metamask',
    [library]
  )

  return (
    <HoverCard>
      <AutoColumn gap="12px">
        <FixedHeightRow
          onClick={() => setShowMore(!showMore)}
          style={{ cursor: 'pointer' }}
          data-id={`${currency0.symbol}-${currency1.symbol}-dropdown`}
        >
          <RowFixed>
            <DoubleCurrencyLogo
              currency0={currency0}
              currency1={currency1}
              margin
              size={20}
            />
            <Text
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {!currency0 || !currency1 ? (
                <Dots>{t('loading')}</Dots>
              ) : (
                `${currency0.symbol}/${currency1.symbol}`
              )}
            </Text>

            <CopyButtonWrapper
              data-id="copy-lp-token-address-button"
              variant="text"
              onClick={handleAddressCopy}
              title={t('copyLPTokensAddress')}
            >
              <ColoredCopyIcon width="24px" height="24px" data-id="copy-icon" />
            </CopyButtonWrapper>
            {isMetamask && (
              <Tooltip placement="right" title={t('addToMetamask')}>
                <AddButton
                  data-id="add-to-metamask-button"
                  ml={2}
                  onClick={onAddCurrencyToMetamask}
                />
              </Tooltip>
            )}
          </RowFixed>
          <RowFixed>
            {showMore ? (
              <ArrowDropUpIcon style={{ marginLeft: '10px' }} />
            ) : (
              <ArrowDropDownIcon style={{ marginLeft: '10px' }} />
            )}
          </RowFixed>
        </FixedHeightRow>
        {showMore && (
          <AutoColumn gap="8px" triggerMobile>
            <FixedHeightRow background>
              <RowFixed>
                <Text color="#909090">
                  {t('pooled')} {currency0.symbol}:
                </Text>
              </RowFixed>
              {token0Deposited ? (
                <RowFixed>
                  <Text ml="6px" color="#009CE1">
                    {token0Deposited?.toSignificant(6)}
                  </Text>
                  <CurrencyLogo
                    size="20px"
                    style={{ marginLeft: '8px' }}
                    currency={currency0}
                  />
                </RowFixed>
              ) : (
                '-'
              )}
            </FixedHeightRow>

            <FixedHeightRow>
              <RowFixed>
                <Text color="#909090">
                  {t('pooled')} {currency1.symbol}:
                </Text>
              </RowFixed>
              {token1Deposited ? (
                <RowFixed>
                  <Text ml="6px" color="#009CE1">
                    {token1Deposited?.toSignificant(6)}
                  </Text>
                  <CurrencyLogo
                    size="20px"
                    style={{ marginLeft: '8px' }}
                    currency={currency1}
                  />
                </RowFixed>
              ) : (
                '-'
              )}
            </FixedHeightRow>
            <FixedHeightRow background>
              <Text color="#909090">{t('yourPoolTokens')}</Text>
              <Text color="#009CE1">
                {userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}
              </Text>
            </FixedHeightRow>
            <FixedHeightRow>
              <Text color="#909090">{t('yourPoolShare')}:</Text>
              <Text color="#009CE1">
                {poolTokenPercentage
                  ? `${poolTokenPercentage.toFixed(2)}%`
                  : '-'}
              </Text>
            </FixedHeightRow>

            <RowBetween marginTop="10px">
              <Button
                as={Link}
                to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}
                data-id="add-liquidity-button"
                // style={{ width: '48%' }}
              >
                {t('add')}
              </Button>
              <Button
                variant="dark"
                as={Link}
                // style={{ width: '48%' }}
                to={`/remove/${currencyId(currency0)}/${currencyId(currency1)}`}
                data-id="remove-liquidity-button"
              >
                {t('remove')}
              </Button>
            </RowBetween>
          </AutoColumn>
        )}
      </AutoColumn>
    </HoverCard>
  )
}
