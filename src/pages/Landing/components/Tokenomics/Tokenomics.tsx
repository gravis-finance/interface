import { Flex, Image, Text } from '@gravis.finance/uikit'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import TOKENOMICS_IMAGE from 'assets/images/landing/tokenomics.svg'
import { BinanaceIcon, PolygonIcon } from 'components/Svg'
import useGetTokensData from 'hooks/useGetTokensData'

import BLOCKS_CONFIG from '../../blocks-config'
import TOKEN_INFO_CONFIG from '../../token-info-config'
import Button from '../Button'
import BaseContainer from '../Container'
import TokenCard from '../TokenCard'
import { getMarketCap } from '../utils'

const Container = styled(BaseContainer)``

const TokenomicsImage = styled(Image).attrs({
  src: TOKENOMICS_IMAGE,
  alt: 'tokenomics image',
  width: 510,
  height: 611
})`
  margin-top: 60px;

  @media screen and (max-width: 1200px) {
    display: none;
  }
`

const Content = styled.div`
  display: flex;
  max-width: 1280px;
  width: 100%;

  @media screen and (max-width: 1200px) {
    flex-direction: column;
    align-items: center;
  }
`

const Info = styled.div`
  max-width: 640px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media screen and (max-width: 1200px) {
    flex-direction: column;
    align-items: center;
  }
`

const Title = styled(Text)`
  font-size: 65px;
  font-weight: 700;
  letter-spacing: -0.01em;
  text-align: left;
  line-height: 1.1;

  @media screen and (max-width: 1200px) {
    margin-bottom: 30px;
    font-size: 50px;
  }

  @media screen and (max-width: 700px) {
    font-size: 40px;
  }
`

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;

  @media screen and (max-width: 1200px) {
    align-items: center;
    max-width: 450px;
  }
`

const StyledTokenCard = styled(TokenCard)`
  @media screen and (max-width: 860px) {
    .title {
      text-align: center;
    }

    .description {
      text-align: center;
    }

    .data-wrapper {
      justify-content: center;
    }

    .header {
      justify-content: center;
    }
  }
`

const StyledBinanaceIcon = styled(BinanaceIcon)`
  path {
    fill: #f3ba2f;
  }

  path.letters {
    fill: #ffffff;
  }
`

const StyledPolygonIcon = styled(PolygonIcon)`
  path {
    fill: #8247e5;
  }

  path.letters {
    fill: #ffffff;
  }
`

const StyledButton = styled(Button)<{ isSelected: boolean }>`
  background: rgba(255, 255, 255, 0.1);
  padding-left: 12px;

  ${({ isSelected }) =>
    isSelected
      ? css`
          background: rgba(255, 255, 255);

          path.letters {
            fill: #000000;
          }
        `
      : null}
`

const BUTTONS = [
  { id: 0, image: <StyledBinanaceIcon /> },
  { id: 1, image: <StyledPolygonIcon /> }
]

const NETWORKS = ['bsc', 'polygon']

const Tokenomics = () => {
  const { t } = useTranslation()
  const [selected, setSelected] = useState(0)
  const { isLoading: isTokenDataLoading, data: tokenData } = useGetTokensData(
    NETWORKS[selected]
  )

  return (
    <Container id={BLOCKS_CONFIG.TOKENOMICS.link}>
      <Content>
        <Info>
          <Title>{t('Tokenomics')}</Title>
          <TokenomicsImage />
        </Info>
        <CardWrapper>
          <Flex style={{ gap: 10 }}>
            {BUTTONS.map(({ image, id }, index) => (
              <StyledButton
                key={id}
                isSelected={selected === index}
                onClick={() => setSelected(index)}
                style={{ height: 35 }}
              >
                {image}
              </StyledButton>
            ))}
          </Flex>
          {TOKEN_INFO_CONFIG.map((props) => {
            const tokenDataItem = tokenData
              ? tokenData[props.title.toLocaleLowerCase()]
              : null

            return (
              <StyledTokenCard
                key={props.title}
                {...props}
                marketCap={getMarketCap(
                  tokenDataItem?.total,
                  tokenDataItem?.price
                )}
                price={tokenDataItem?.price}
                circularSupply={tokenDataItem?.live_count}
                isLoading={isTokenDataLoading}
              />
            )
          })}
        </CardWrapper>
      </Content>
    </Container>
  )
}

export default Tokenomics
