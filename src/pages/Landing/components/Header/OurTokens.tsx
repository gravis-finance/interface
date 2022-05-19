import { ButtonBase, Flex, Text } from '@gravis.finance/uikit'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import styled, { css } from 'styled-components'

import { ArrowBottom } from 'components/Svg'
import { useActiveWeb3React } from 'hooks'
import useGetTokensData from 'hooks/useGetTokensData'

import TOKEN_INFO_CONFIG from '../../token-info-config'
import MoreInfoItem from '../MoreInfoItem'
import TokenCard from '../TokenCard'
import TokenInfo from '../TokenInfo'
import TransparentButton from '../TransparentButton'
import { getMarketCap } from '../utils'

const Container = styled.div`
  background: #141621;
  border-radius: 15px;
`

const StyledButtonBase = styled(ButtonBase)<{ hide?: boolean }>`
  opacity: 0.7;

  ${Text} {
    font-weight: 600;
  }

  ${({ hide }) =>
    hide &&
    css`
      svg {
        transform: rotate(180deg);
      }
    `}

  path {
    fill: #ffffff;
  }
`

const StyledTokenCard = styled(TokenCard)`
  background: none;
  border-radius: none;
  padding: 0;
`

const StyledTransparentButton = styled(TransparentButton)`
  height: 35px;
  padding: 15px;
  margin-left: 15px;
  width: 55px;
`

const StyledTokenInfo = styled(TokenInfo)`
  @media screen and (max-width: 440px) {
    width: 100%;
    justify-content: start;
  }
`

const TokenInfoWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;

  @media screen and (max-width: 440px) {
    flex-direction: column;
    gap: 10px;

    > div {
      width: 100%;
    }
  }
`

const OurTokens = () => {
  const { t } = useTranslation()
  const { chainId } = useActiveWeb3React()
  const history = useHistory()
  const [isExpanded, setIsExpanded] = useState(false)
  const { isLoading: isTokenDataLoading, data: tokenData } = useGetTokensData()

  return (
    <Container>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        p="20px"
        style={{
          height: 60,
          fontWeight: 700,
          borderBottom: '1px solid rgba(255,255,255, 0.08)'
        }}
      >
        <Text style={{ fontWeight: 700 }} fontSize="18px">
          {t('Our tokens')}
        </Text>
        {isExpanded ? (
          <StyledButtonBase hide onClick={() => setIsExpanded(false)}>
            <Text mr="8px">{t('Hide')}</Text>
            <ArrowBottom />
          </StyledButtonBase>
        ) : (
          <StyledButtonBase onClick={() => setIsExpanded(true)}>
            <Text mr="8px">{t('Learn more')}</Text>
            <ArrowBottom />
          </StyledButtonBase>
        )}
      </Flex>
      {isExpanded ? (
        <Flex
          flexWrap="wrap"
          flexDirection="column"
          p="20px"
          justifyContent="space-between"
        >
          {TOKEN_INFO_CONFIG.map((props, index) => {
            const tokenDataItem = tokenData
              ? tokenData[props.title.toLocaleLowerCase()]
              : null

            return (
              <Flex
                flexDirection="column"
                style={
                  TOKEN_INFO_CONFIG.length - 1 !== index
                    ? {
                        paddingBottom: 35,
                        borderBottom: '1px solid rgba(255,255,255, 0.08)'
                      }
                    : { paddingTop: 35 }
                }
              >
                <StyledTokenCard
                  {...props}
                  marketCap={getMarketCap(
                    tokenDataItem?.total,
                    tokenDataItem?.price
                  )}
                  circularSupply={tokenDataItem?.live_count}
                  price={tokenDataItem?.price}
                  isLoading={isTokenDataLoading}
                />
                <Flex mt="30px" flexDirection="column">
                  <Text mb="20px" style={{ fontWeight: 700 }}>
                    {t('More info on')}
                  </Text>
                  <Flex style={{ gap: '20px 15px' }} flexWrap="wrap">
                    {props.moreInfo?.map((item) => {
                      return (
                        <MoreInfoItem link={item.getLink(chainId)} {...item} />
                      )
                    })}
                  </Flex>
                </Flex>
              </Flex>
            )
          })}
        </Flex>
      ) : (
        <TokenInfoWrapper>
          {TOKEN_INFO_CONFIG.map(({ icon, title, getBuyLink }) => {
            const tokenDataItem = tokenData
              ? tokenData[title.toLocaleLowerCase()]
              : null

            return (
              <Flex>
                <StyledTokenInfo
                  isLoading={isTokenDataLoading}
                  value={tokenDataItem?.price}
                  image={icon}
                  title={title}
                />
                <StyledTransparentButton
                  onClick={() =>
                    chainId ? history.push(getBuyLink(chainId)) : null
                  }
                >
                  {t('Buy')}
                </StyledTransparentButton>
              </Flex>
            )
          })}
        </TokenInfoWrapper>
      )}
    </Container>
  )
}

export default OurTokens
