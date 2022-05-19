import { Image, Text } from '@gravis.finance/uikit'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import BIG_ROUND_IMAGE from 'assets/images/landing/first-screen/big-round.svg'
import BUILDING_IMAGE from 'assets/images/landing/first-screen/building.svg'
import GRAPHIC_IMAGE from 'assets/images/landing/first-screen/graphic.svg'
import MARKER_IMAGE from 'assets/images/landing/first-screen/marker.svg'
import SMALL_ROUND_IMAGE from 'assets/images/landing/first-screen/small-round.svg'
import SYMBOL1_IMAGE from 'assets/images/landing/first-screen/symbol1.svg'
import SYMBOL2_IMAGE from 'assets/images/landing/first-screen/symbol3.svg'
import SYMBOL_IMAGE from 'assets/images/landing/first-screen/symbol.svg'
import useMediaQuery from 'hooks/useMediaQuery'

import Button from '../Button'
import BaseContainer from '../Container'
import TransparentButton from '../TransparentButton'
import PoweredBy from './PoweredBy'

const Description = styled(Text)`
  font-size: 16px;
  color: #ffffff;
  text-align: left;
  opacity: 0.7;
  margin-top: 10px;

  @media screen and (max-width: 860px) {
    text-align: center;
  }
`

const Title = styled(Text)`
  font-size: 65px;
  font-weight: 800;
  letter-spacing: -0.01em;
  text-align: left;
  line-height: 1.1;

  @media screen and (max-width: 860px) {
    text-align: center;
  }

  @media screen and (max-width: 780px) {
    font-size: 50px;
  }

  @media screen and (max-width: 540px) {
    width: auto;
    font-size: 40px;
  }
`

const Info = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 0 20px;
  max-width: 420px;

  @media screen and (max-width: 860px) {
    margin-top: 40px;
    max-height: 600px;
    height: 100%;
    justify-content: center;
  }
`

const ImagesContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  max-width: 745px;
  max-height: 590px;

  @media screen and (max-width: 860px) {
    margin-bottom: 10px;
  }
`

const BaseImage = styled(Image)`
  position: absolute;
  object-fit: cover;
`

const SymbolImage = styled(BaseImage).attrs({
  src: SYMBOL_IMAGE,
  alt: 'symbol image',
  width: 23,
  height: 57
})`
  bottom: 95px;
  left: 50px;
  height: 5vw;

  @media screen and (max-width: 1100px) {
    left: 15px;
  }

  @media screen and (max-width: 860px) {
    height: 40px;
    bottom: 6vh;
    left: -5vw;
  }
`

const Symbol1Image = styled(BaseImage).attrs({
  src: SYMBOL1_IMAGE,
  alt: 'symbol image',
  width: 8,
  height: 71
})`
  bottom: 170px;
  right: 110px;

  @media screen and (max-width: 1260px) {
    right: 30px;
  }

  @media screen and (max-width: 860px) {
    display: none;
  }
`

const Symbol2Image = styled(BaseImage).attrs({
  src: SYMBOL2_IMAGE,
  alt: 'symbol image',
  width: 23,
  height: 39
})`
  top: 170px;
  left: calc(50% + 40px);

  @media screen and (max-width: 860px) {
    display: none;
  }
`

const GraphicImage = styled(BaseImage).attrs({
  src: GRAPHIC_IMAGE,
  alt: 'symbol image',
  width: 128,
  height: 77
})`
  top: 130px;
  right: 87px;
  width: 10vw;

  @media screen and (max-width: 1260px) {
    right: 30px;
  }

  @media screen and (max-width: 960px) {
    display: none;
  }
`

const BigRoundImage = styled(BaseImage).attrs({
  src: BIG_ROUND_IMAGE,
  alt: 'big round image',
  width: 386,
  height: 386
})`
  top: 0;
  left: 0;
  width: 30vw;

  @media screen and (max-width: 860px) {
    width: 60vw;
    height: 60vw;
    top: -3vh;
    left: -27vw;
    transform: rotate(55deg);
  }
`

const BuildingImage = styled(BaseImage).attrs({
  src: BUILDING_IMAGE,
  alt: 'building image',
  width: 430,
  height: 360
})`
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 32vw;

  @media screen and (max-width: 860px) {
    width: 100%;
    max-height: 100%;
    max-height: calc(100% - 60px);
    bottom: 20px;
  }
`

const SmallRoundImage = styled(BaseImage).attrs({
  src: SMALL_ROUND_IMAGE,
  alt: 'small round image',
  width: 100,
  height: 100
})`
  bottom: 0;
  right: 0;

  @media screen and (max-width: 860px) {
    transform: rotate(55deg);
    right: -10vw;
  }
`

const MarkerImage = styled(BaseImage).attrs({
  src: MARKER_IMAGE,
  alt: 'marker image',
  width: 202,
  height: 53
})`
  width: 100%;
  height: 100%;
  max-width: 202px;
  max-height: 53px;
  top: 50px;
  left: 20vw;

  @media screen and (max-width: 860px) {
    width: 35vw;
    top: 0.5vh;
    right: 0;
    left: auto;
  }
`

const Container = styled(BaseContainer)`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: calc(100% - 129px);
  width: 100%;
  z-index: 2;
  position: relative;
  height: 100vh;
  padding-top: 0;
  padding-bottom: 0;
`

const ButtonWrapper = styled.div`
  display: flex;
  margin-top: 40px;
  gap: 15px;
  justify-content: start;
  width: 100%;

  > button {
    max-width: 200px;
    letter-spacing: -0.02em;
  }

  @media screen and (max-width: 860px) {
    width: 100%;
    margin-top: 30px;

    > a {
      width: 50%;
    }

    > button {
      width: 50%;
    }
  }
`

const Content = styled.div`
  max-width: 1440px;
  width: 100%;
  height: calc(100% - 100px);
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media screen and (max-width: 860px) {
    flex-direction: column;
    justify-content: baseline;
  }
`

const FirstScreen = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const isMobile = useMediaQuery('(max-width: 860px)')

  return (
    <Container>
      <Content>
        <Info>
          <Title>{t('Multi-chain AMM DEX')}</Title>
          <Description>
            {t(
              'With cross-chain ERC20 and NFT bridge, and high-yield farming and auto-farming'
            )}
          </Description>
          <ButtonWrapper>
            <Button onClick={() => history.push('/swap')}>
              {t('Trade now')}
            </Button>
            <TransparentButton
              onClick={() =>
                window.open(
                  `${process.env.REACT_APP_FARMING_URL}/staking`,
                  '_blank'
                )
              }
            >
              {t(isMobile ? 'Stake tokens' : 'Stake GRVS & GRVX')}
            </TransparentButton>
          </ButtonWrapper>
        </Info>
        <ImagesContainer>
          <BuildingImage />
          <SmallRoundImage />
          <BigRoundImage />
          <MarkerImage />
          <GraphicImage />
          <SymbolImage />
          <Symbol1Image />
          <Symbol2Image />
        </ImagesContainer>
      </Content>
      <PoweredBy />
    </Container>
  )
}

export default FirstScreen
