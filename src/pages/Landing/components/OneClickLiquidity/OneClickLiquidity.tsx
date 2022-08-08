import { Image, Text } from '@gravis.finance/uikit'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import DOLLAR_1_IMAGE from 'assets/images/landing/one-click-liquidity/dollar-1.svg'
import DOLLAR_IMAGE from 'assets/images/landing/one-click-liquidity/dollar.svg'
import PARACHUTE_DOLLAR_IMAGE from 'assets/images/landing/one-click-liquidity/parachute-dollar.svg'
import PARACHUTE_GRVS_IMAGE from 'assets/images/landing/one-click-liquidity/parachute-grvs.svg'
import ROUND_IMAGE from 'assets/images/landing/one-click-liquidity/round.svg'
import SQUARE_IMAGE from 'assets/images/landing/one-click-liquidity/square.svg'
import STAR_EMPTY_IMAGE from 'assets/images/landing/one-click-liquidity/star-empty.svg'
import STAR_IMAGE from 'assets/images/landing/one-click-liquidity/star.svg'

import BLOCKS_CONFIG from '../../blocks-config'
import Button from '../Button'
import BaseContainer from '../Container'

const Container = styled(BaseContainer)`
  @media screen and (max-width: 620px) {
    padding-top: 70px;
  }
`

const ParachuteDollarImage = styled(Image).attrs({
  src: PARACHUTE_DOLLAR_IMAGE,
  alt: 'parachute dollar',
  width: 273,
  height: 481
})`
  left: 0;
  top: 0;
  position: absolute;

  @media screen and (max-width: 1160px) {
    top: -30px;
    height: 275px;
  }

  @media screen and (max-width: 860px) {
    left: -30px;
  }

  @media screen and (max-width: 620px) {
    left: -90px;
  }
`

const ParachuteGrvsImage = styled(Image).attrs({
  src: PARACHUTE_GRVS_IMAGE,
  alt: 'parachute grvs',
  width: 329,
  height: 439
})`
  right: 0;
  bottom: 0;
  position: absolute;

  @media screen and (max-width: 1160px) {
    height: 275px;
  }

  @media screen and (max-width: 860px) {
    right: -40px;
    bottom: -20px;
  }

  @media screen and (max-width: 620px) {
    right: -140px;
  }
`

const StarEmptyImage = styled(Image).attrs({
  src: STAR_EMPTY_IMAGE,
  alt: 'star',
  width: 22,
  height: 28
})`
  left: 0;
  bottom: 120px;
  position: absolute;

  @media screen and (max-width: 1160px) {
    height: 23px;
    bottom: auto;
    top: 160px;
    left: 50%;
  }

  @media screen and (max-width: 620px) {
    top: 210px;
    left: calc(50% + 30px);
  }
`

const StarImage = styled(Image).attrs({
  src: STAR_IMAGE,
  alt: 'star',
  width: 41,
  height: 52
})`
  right: 50%;
  top: 68px;
  position: absolute;

  @media screen and (max-width: 1160px) {
    height: 23px;
    bottom: 30px;
    top: auto;
    left: 50%;
  }

  @media screen and (max-width: 620px) {
    bottom: -40px;
  }
`

const SquareImage = styled(Image).attrs({
  src: SQUARE_IMAGE,
  alt: 'square',
  width: 12,
  height: 12
})`
  right: 0;
  top: 200px;
  position: absolute;

  @media screen and (max-width: 1160px) {
    display: none;
  }
`

const RoundImage = styled(Image).attrs({
  src: ROUND_IMAGE,
  alt: 'round',
  width: 22,
  height: 22
})`
  left: 50%;
  bottom: 90px;
  position: absolute;

  @media screen and (max-width: 1160px) {
    display: none;
  }
`

const DollarImage = styled(Image).attrs({
  src: DOLLAR_IMAGE,
  alt: 'dollar',
  width: 328,
  height: 188
})`
  right: 140px;
  top: 0;
  position: absolute;

  @media screen and (max-width: 1160px) {
    top: 60px;
    right: 50px;
  }

  @media screen and (max-width: 860px) {
    right: -40px;
  }

  @media screen and (max-width: 620px) {
    right: -100px;
  }
`

const Dollar1Image = styled(Image).attrs({
  src: DOLLAR_1_IMAGE,
  alt: 'dollar',
  width: 225,
  height: 185
})`
  left: 200px;
  bottom: 0;
  position: absolute;

  @media screen and (max-width: 1160px) {
    left: 100px;
    transform: rotate(180deg) scale(-1, 1);
  }

  @media screen and (max-width: 860px) {
    left: 20px;
  }

  @media screen and (max-width: 620px) {
    left: -50px;
  }
`

const Content = styled.div`
  position: relative;
  display: flex;
  max-width: 1280px;
  width: 100%;
  justify-content: center;
  height: 790px;
`

const Info = styled.div`
  max-width: 640px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Description = styled(Text)`
  font-size: 16px;
  color: #ffffff;
  text-align: center;
  opacity: 0.7;
  margin-top: 10px;
  max-width: 490px;
  width: 100%;

  @media screen and (max-width: 780px) {
    max-width: 380px;
    font-size: 18px;
    font-weight: 600;
  }

  @media screen and (max-width: 540px) {
    max-width: 300px;
    font-size: 16px;
  }
`

const Title = styled(Text)`
  font-size: 65px;
  font-weight: 700;
  letter-spacing: -0.01em;
  text-align: center;
  line-height: 1.1;

  @media screen and (max-width: 780px) {
    font-size: 50px;
    max-width: 360px;
  }

  @media screen and (max-width: 540px) {
    width: auto;
    font-size: 40px;
  }
`

const OneClickLiquidity = () => {
  const { t } = useTranslation()
  const history = useHistory()

  return (
    <Container id={BLOCKS_CONFIG.MIGRATION.link}>
      <Content>
        <Info>
          <Title>{t('1-click liquidity migration')}</Title>
          <Description>{t('See the list of supported pairs')}</Description>
          <Button mt="35px" onClick={() => history.push('/migrate')} data-id="migrate-liquidity-button">
            {t('Migrate liquidity')}
          </Button>
        </Info>
        <StarImage />
        <StarEmptyImage />
        <SquareImage />
        <RoundImage />
        <ParachuteDollarImage />
        <ParachuteGrvsImage />
        <DollarImage />
        <Dollar1Image />
      </Content>
    </Container>
  )
}

export default OneClickLiquidity
