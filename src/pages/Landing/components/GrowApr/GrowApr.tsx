import { Image, Text } from '@gravis.finance/uikit'
import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import FLOWER_MOBILE_IMAGE from 'assets/images/landing/flower-mobile.svg'
import FLOWER_IMAGE from 'assets/images/landing/flower.webp'
import GRVS_FLOWER_IMAGE from 'assets/images/landing/grvs-flower.svg'

import BLOCKS_CONFIG from '../../blocks-config'
import Button from '../Button'
import BaseContainer from '../Container'

const ContentWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: start;
  background-size: cover;
  border-radius: 50px;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 570px;
  z-index: 10;

  @media screen and (max-width: 1320px) {
    margin-right: 80px;
    margin-left: 40px;
  }

  @media screen and (max-width: 1160px) {
    align-items: center;
    margin-left: auto;
    margin-right: auto;
  }

  @media screen and (max-width: 780px) {
    padding-right: 30px;
    padding-left: 30px;
  }
`

const StyledButton = styled(Button)`
  width: 150px;
  height: 50px;

  @media screen and (max-width: 540px) {
    width: 100%;
  }
`

const Card = styled.div`
  display: flex;
  width: 100%;
  max-width: 1280px;
  height: 800px;
  position: relative;
  background: linear-gradient(89.84deg, #eed991 0%, #ccf7f4 99.65%),
    linear-gradient(89.84deg, #eed991 0%, #ccf7f4 99.65%), #ffffff;
  border-radius: 50px;
  background-size: cover;

  @media screen and (max-width: 470px) {
    height: 850px;
  }
`

const Title = styled(Text)`
  font-size: 65px;
  font-weight: 700;
  margin-bottom: 15px;
  letter-spacing: -0.01em;
  color: #000000;
  line-height: 105%;
  max-width: 470px;

  @media screen and (max-width: 1160px) {
    text-align: center;
  }

  @media screen and (max-width: 780px) {
    margin-bottom: 30px;
    font-size: 50px;
  }

  @media screen and (max-width: 540px) {
    width: auto;
    font-size: 40px;
  }
`

const Description = styled(Text)`
  color: #000000;
  font-weight: 600;
  margin-bottom: 35px;

  @media screen and (max-width: 1160px) {
    text-align: center;
  }
`

const ImagesContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  @media screen and (max-width: 1160px) {
    position: absolute;
  }
`

const BaseImage = styled(Image)`
  position: absolute;
  object-fit: cover;
`

const FlowerImage = styled(BaseImage).attrs({
  src: FLOWER_IMAGE,
  alt: 'flower',
  width: 511,
  height: 760
})`
  left: 0;
  bottom: 0;

  @media screen and (max-width: 1160px) {
    height: 177px;
    width: 270px;
    content: url(${FLOWER_MOBILE_IMAGE});
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
  }
`

const GrvsFlowerImage = styled(BaseImage).attrs({
  src: GRVS_FLOWER_IMAGE,
  alt: 'grvs image',
  width: 500,
  height: 262
})`
  left: 90px;
  bottom: 0;

  @media screen and (max-width: 1160px) {
    height: 200px;
    width: 270px;
    position: absolute;

    left: 50%;
    transform: translateX(-50%);
  }
`

const Container = styled(BaseContainer)`
  @media screen and (max-width: 550px) {
    padding: 30px 0;
  }
`

const GrowApr = () => {
  const { t } = useTranslation()

  return (
    <Container id={BLOCKS_CONFIG.STAKING.link}>
      <Card>
        <ImagesContainer>
          <FlowerImage />
          <GrvsFlowerImage />
        </ImagesContainer>
        <ContentWrapper>
          <Content>
            <Title>{t('Grow your APR from staking up to 100%')}</Title>
            <Description>
              {t(
                'Stake our governance token GRVS and our utility token GRVX. The more GRVS you stake, the more APR you get.'
              )}
            </Description>
            <StyledButton
              isBlack
              onClick={() =>
                window.open(
                  `${process.env.REACT_APP_FARMING_URL}/staking`,
                  '_blank'
                )
              }
            >
              {t('Stake tokens')}
            </StyledButton>
          </Content>
        </ContentWrapper>
      </Card>
    </Container>
  )
}

export default GrowApr
