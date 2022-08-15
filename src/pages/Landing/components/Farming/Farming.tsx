import { Image, Text, getNetworkId } from '@gravis.finance/uikit'
import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import WALLET_IMAGE from 'assets/images/landing/wallet.svg'

import BLOCKS_CONFIG from '../../blocks-config'
import BaseContainer from '../Container'

const Container = styled(BaseContainer)``

const WalletImage = styled(Image).attrs({
  src: WALLET_IMAGE,
  alt: 'wallet image',
  width: 640,
  height: 439
})`
  padding: 20px 0;

  @media screen and (max-width: 860px) {
    margin-top: 40px;
  }
`

const Content = styled.div`
  display: flex;
  max-width: 1280px;
  width: 100%;

  @media screen and (max-width: 860px) {
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

  @media screen and (max-width: 860px) {
    align-items: center;
  }
`

const Description = styled(Text)`
  font-size: 16px;
  color: #ffffff;
  text-align: left;
  opacity: 0.7;
  margin-top: 10px;
  max-width: 490px;
  width: 100%;

  @media screen and (max-width: 860px) {
    text-align: center;
  }
`

const Title = styled(Text)`
  font-size: 65px;
  font-weight: 700;
  letter-spacing: -0.01em;
  text-align: left;
  line-height: 1.1;

  @media screen and (max-width: 1260px) {
    font-size: 50px;
  }

  @media screen and (max-width: 540px) {
    font-size: 40px;
  }

  @media screen and (max-width: 860px) {
    text-align: center;
  }
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
    justify-content: center;
  }

  @media screen and (max-width: 540px) {
    width: 100%;

    > a {
      width: 50%;
    }

    > button {
      width: 50%;
    }
  }
`

const LinkedButton = styled.a`
  user-select: none;
  align-items: center;
  border-radius: 41px;
  cursor: pointer;
  display: inline-flex;
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  width: max-content;
  height: 48px;
  line-height: 1;
  justify-content: center;
  outline: 0;
  padding: 0 24px;
  transition: background 0.2s ease-in-out, box-shadow 0.2s ease-in-out,
    border 0.2s ease-in-out, color 0.2s ease-in-out;
  opacity: 1;
  background-color: #ffffff;
  color: #000000;
  border: none;
  box-shadow: none;
  max-width: 200px;
  letter-spacing: -0.02em;

  :hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: #ffffff;
  }
`

const TransparentLinkedButton = styled.a`
  user-select: none;
  align-items: center;
  background: #242424;
  color: #ffffff;
  cursor: pointer;
  display: inline-flex;
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  width: max-content;
  height: 48px;
  line-height: 1;
  justify-content: center;
  outline: 0;
  padding: 0 24px;
  transition: background 0.2s ease-in-out, box-shadow 0.2s ease-in-out,
    border 0.2s ease-in-out;
  opacity: 1;
  background: rgba(255, 255, 255, 0.15);
  -webkit-backdrop-filter: blur(15px);
  backdrop-filter: blur(15px);
  border: none;
  box-shadow: none;
  border-radius: 46px;
  max-width: 200px;
  letter-spacing: -0.02em;

  :hover {
    background: rgba(255, 255, 255, 0.1);
  }
`

const Farming = () => {
  const { t } = useTranslation()
  const networkId = getNetworkId()

  return (
    <Container id={BLOCKS_CONFIG.FARMING.link}>
      <Content>
        <Info>
          <Title>{t('Farming & advanced autofarming')}</Title>
          <Description>
            {t(
              'Higher than other projects yield is ensured by smart contract management and unique strategies'
            )}
          </Description>
          <ButtonWrapper>
            <LinkedButton
              href={`${process.env.REACT_APP_AUTOFARMING_URL}/autofarming?network=${networkId}`}
              target="_blank"
              data-id="start-autofarming-button"
            >
              {t('Start auto-farming')}
            </LinkedButton>
            <TransparentLinkedButton
              href={`${process.env.REACT_APP_FARMING_URL}/farms?network=${networkId}`}
              target="_blank"
              data-id="start-farming-button"
            >
              {t('Start farming')}
            </TransparentLinkedButton>
          </ButtonWrapper>
        </Info>
        <WalletImage />
      </Content>
    </Container>
  )
}

export default Farming
