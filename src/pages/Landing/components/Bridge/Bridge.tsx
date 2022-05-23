import { Image, Text } from '@gravis.finance/uikit'
import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import BRIDGE_BACKGROUND_MOBILE_IMAGE from 'assets/images/landing/bridge-background-mobile.svg'
import BRIDGE_BACKGROUND_IMAGE from 'assets/images/landing/bridge-background.svg'
import GRVS_BRIDGE_IMAGE from 'assets/images/landing/grvs-bridge.svg'
import { Dots } from 'components/swap/styleds'
import useBridgeData from 'hooks/useBridgeData'

import BLOCKS_CONFIG from '../../blocks-config'
import Button from '../Button'
import BaseContainer from '../Container'

const Description = styled(Text)`
  color: #000000;
  font-weight: 600;

  @media screen and (max-width: 860px) {
    text-align: center;
  }
`

const LeftSide = styled.div`
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  ${Description} {
    margin-bottom: 35px;
  }

  @media screen and (max-width: 1360px) {
    width: 60%;
  }

  @media screen and (max-width: 1160px) {
    width: 65%;
  }

  @media screen and (max-width: 860px) {
    width: 100%;
    padding: 0 40px;
  }

  @media screen and (max-width: 400px) {
    padding: 0 20px;
  }
`

const RightSide = styled.div`
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;

  @media screen and (max-width: 1360px) {
    width: 40%;
  }

  @media screen and (max-width: 1160px) {
    width: 35%;
  }
`

const StyledButton = styled(Button)`
  width: 150px;
  height: 50px;
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
  overflow: hidden;

  @media screen and (max-width: 1360px) {
    height: 700px;
  }

  @media screen and (max-width: 860px) {
    height: 800px;
    flex-direction: column;
    align-items: center;
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

  @media screen and (max-width: 860px) {
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

const BridgeBackgroundImage = styled(Image).attrs({
  src: BRIDGE_BACKGROUND_IMAGE,
  alt: 'schema image',
  width: 1000,
  height: 1000
})`
  position: absolute;
  width: 60%;
  height: 100%;
  right: 0;

  @media screen and (max-width: 1360px) {
    right: -100px;
  }

  @media screen and (max-width: 860px) {
    right: auto;
    bottom: -150px;
    content: url(${BRIDGE_BACKGROUND_MOBILE_IMAGE});
    height: min-content;
    width: 100%;
    max-width: 460px;
  }

  @media screen and (max-width: 540px) {
    bottom: -50px;
    max-width: 580px;
  }

  @media screen and (max-width: 490px) {
    bottom: 0;
  }

  @media screen and (max-width: 380px) {
    bottom: 30px;
  }
`

const Container = styled(BaseContainer)`
  @media screen and (max-width: 860px) {
    padding: 30px 0;
  }
`

const GrvsBridgeImage = styled(Image).attrs({
  src: GRVS_BRIDGE_IMAGE,
  alt: 'grvs image',
  width: 149,
  height: 137
})`
  @media screen and (max-width: 860px) {
    display: none;
  }
`

const LeftContent = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 40px;
  max-width: 470px;
  z-index: 10;

  @media screen and (max-width: 860px) {
    margin-top: 55px;
    margin-left: 0;
    align-items: center;
  }
`

const Transfered = styled.div`
  display: flex;
  z-index: 10;
  flex-direction: column;
  align-items: center;
  margin-right: 40px;

  @media screen and (max-width: 860px) {
    width: max-content;
    margin-right: 0;
  }

  @media screen and (max-width: 540px) {
    position: absolute;
    bottom: 60px;
    bottom: 40px;
  }
`

const Bridge = () => {
  const { t } = useTranslation()
  const { data: amount, isLoading } = useBridgeData()

  return (
    <Container id={BLOCKS_CONFIG.BRIDGING.link}>
      <Card>
        <BridgeBackgroundImage />
        <LeftSide>
          <LeftContent>
            <Title>{t('Bridge your GRVS & GRVX tokens and NFT')}</Title>
            <Description>
              {t(
                'Across BNB Chain, Polygon and Aurora. More tokens and networks are coming soon.'
              )}
            </Description>
            <StyledButton
              isBlack
              onClick={() => window.open(process.env.REACT_APP_BRIDGE_URL)}
            >
              {t('Bridge now')}
            </StyledButton>
          </LeftContent>
        </LeftSide>
        <RightSide>
          <Transfered>
            <GrvsBridgeImage />
            <Text
              color="#000000"
              style={{ fontWeight: 700, width: 'max-content' }}
              fontSize="32px"
              mt="20px"
            >
              $ {isLoading ? <Dots /> : amount}
            </Text>
            <Description>{t('Tokens transfered')}</Description>
          </Transfered>
        </RightSide>
      </Card>
    </Container>
  )
}

export default Bridge
