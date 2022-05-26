import { Image, Text } from '@gravis.finance/uikit'
import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import HEADS_IMAGE from 'assets/images/landing/heads.svg'

import BaseContainer from '../Container'
import Partners from './Partners'

const Container = styled(BaseContainer)`
  @media screen and (max-width: 800px) {
    padding: 30px 20px;
  }
`

const Content = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 1280px;

  @media screen and (max-width: 1280px) {
    flex-direction: column;
    justify-content: center;
  }
`

const Title = styled(Text)`
  font-size: 65px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.01em;

  @media screen and (max-width: 1280px) {
    text-align: center;
    margin-bottom: 30px;
  }

  @media screen and (max-width: 700px) {
    font-size: 40px;
  }
`

const LeftSide = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const HeadsImage = styled(Image).attrs({
  src: HEADS_IMAGE,
  alt: 'heads image',
  width: 472,
  height: 438
})`
  bottom: 60px;

  @media screen and (max-width: 1280px) {
    display: none;
  }
`

const OurPartners = () => {
  const { t } = useTranslation()

  return (
    <Container>
      <Content>
        <LeftSide>
          <Title>{t('Our partners')}</Title>
          <HeadsImage />
        </LeftSide>
        <Partners />
      </Content>
    </Container>
  )
}

export default OurPartners
