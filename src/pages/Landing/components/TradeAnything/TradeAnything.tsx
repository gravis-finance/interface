import { Flex, Image, Text } from '@gravis.finance/uikit'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import CLOUD_IMAGE from 'assets/images/landing/cloud.svg'
import EMPTY_CLOUD_IMAGE from 'assets/images/landing/empty-cloud.svg'
import MOBILE_HANDS_IMAGE from 'assets/images/landing/hands-mobile.svg'
import HANDS_IMAGE from 'assets/images/landing/hands.svg'

import BLOCKS_CONFIG from '../../blocks-config'
import Button from '../Button'
import BaseContainer from '../Container'

const ContentContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: start;
  background-size: cover;
  border-radius: 50px;

  @media screen and (max-width: 1260px) {
    justify-content: center;
    padding: 0 20px;
    box-sizing: border-box;
  }
`

const Content = styled.div`
  max-width: 570px;
  display: flex;
  flex-direction: column;
  width: 100%;

  @media screen and (max-width: 1260px) {
    align-items: center;

    > div {
      text-align: center;
    }
  }
`

const StyledButton = styled(Button)`
  width: 150px;
  height: 50px;
  letter-spacing: -0.02em;
`

const AddLiquididtyButton = styled(StyledButton)`
  :hover:not(:disabled):not(.button--disabled):not(:active) {
    background-color: #ffffff;
    color: rgba(0, 0, 0, 0.7);
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

  @media screen and (max-width: 1260px) {
    flex-direction: column;
    height: 600px;
  }
`

const Title = styled(Text)`
  font-size: 65px;
  font-weight: 700;
  margin-bottom: 15px;
  letter-spacing: -0.01em;
  color: #000000;
  line-height: 95%;

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
`

const ImagesContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  @media screen and (max-width: 1260px) {
    height: auto;
  }
`

const BaseImage = styled(Image)`
  position: absolute;
  object-fit: cover;
`

const CloudImage = styled(BaseImage).attrs({
  src: CLOUD_IMAGE,
  alt: 'cloud image',
  width: 521,
  height: 336
})`
  left: -50px;
  top: 65px;

  @media screen and (max-width: 1260px) {
    top: -150px;
    left: 50%;
    transform: translateX(-50%);

    > img {
      padding: 0 20px;
      max-width: 100%;
      box-sizing: border-box;
    }
  }
`

const EmptyCloudImage = styled(BaseImage).attrs({
  src: EMPTY_CLOUD_IMAGE,
  alt: 'cloud image',
  width: 315,
  height: 191
})`
  top: 60px;
  left: 180px;

  @media screen and (max-width: 1260px) {
    display: none;
  }
`

const EmptyCloud1Image = styled(BaseImage).attrs({
  src: EMPTY_CLOUD_IMAGE,
  alt: 'cloud image',
  width: 272,
  height: 165
})`
  top: 60px;
  left: -165px;

  @media screen and (max-width: 1260px) {
    display: none;
  }
`

const HandsImage = styled(BaseImage).attrs({
  src: HANDS_IMAGE,
  alt: 'cloud image',
  width: 500,
  height: 262
})`
  bottom: 65px;

  @media screen and (max-width: 1260px) {
    display: none;
  }
`

const MobileHandsImage = styled(BaseImage).attrs({
  src: MOBILE_HANDS_IMAGE,
  alt: 'cloud image',
  width: 385,
  height: 160
})`
  display: none;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0;

  @media screen and (max-width: 1260px) {
    display: block;
  }
`

const Container = styled(BaseContainer)`
  padding-top: 140px;

  @media screen and (max-width: 550px) {
    padding: 30px 0;
    padding-top: 140px;
  }
`

const ButtonWrapper = styled.div`
  display: flex;
  gap: 15px;

  @media screen and (max-width: 860px) {
    width: 100%;
    justify-content: center;
  }
`

const TradeAnything = () => {
  const { t } = useTranslation()
  const history = useHistory()

  return (
    <Container id={BLOCKS_CONFIG.TRADING.link}>
      <Card>
        <ImagesContainer>
          <Flex style={{ position: 'relative' }}>
            <EmptyCloudImage />
            <EmptyCloud1Image />
            <CloudImage />
          </Flex>
          <HandsImage />
        </ImagesContainer>
        <ContentContainer>
          <Content>
            <Title>{t('Trade anything anywhere')}</Title>
            <Description>
              {t('Trade any asset by only connecting your wallet')}
            </Description>
            <ButtonWrapper>
              <StyledButton isBlack onClick={() => history.push('/swap')}>
                {t('Trade now')}
              </StyledButton>
              <AddLiquididtyButton onClick={() => history.push('/add')}>
                {t('Add liquidity')}
              </AddLiquididtyButton>
            </ButtonWrapper>
          </Content>
        </ContentContainer>
        <MobileHandsImage />
      </Card>
    </Container>
  )
}

export default TradeAnything
