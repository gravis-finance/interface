import { Box, Text } from '@gravis.finance/uikit'
import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import backedBy1 from 'assets/images/landing/supporters/backed1.png'
import backedBy2 from 'assets/images/landing/supporters/backed2.png'
import backedBy3 from 'assets/images/landing/supporters/backed3.png'
import backedBy4 from 'assets/images/landing/supporters/backed4.png'
import backedBy5 from 'assets/images/landing/supporters/backed5.png'
import backedBy6 from 'assets/images/landing/supporters/backed6.png'
import backedBy7 from 'assets/images/landing/supporters/backed7.png'
import backedBy8 from 'assets/images/landing/supporters/backed8.png'
import backedBy9 from 'assets/images/landing/supporters/backed9.png'
import supportedBy1 from 'assets/images/landing/supporters/supported1.svg'
import supportedBy2 from 'assets/images/landing/supporters/supported2.png'
import supportedBy3 from 'assets/images/landing/supporters/supported3.png'
import supportedBy4 from 'assets/images/landing/supporters/supported4.svg'
import supportedBy5 from 'assets/images/landing/supporters/supported5.svg'
import supportedBy6 from 'assets/images/landing/supporters/supported6.png'

import PartnersItem from './PartnersItem'

const Container = styled.div`
  padding-bottom: 2.4rem;

  @media screen and (max-width: 1280px) {
    display: flex;
    align-items: center;
    flex-direction: column;
  }
`

const PARTNERS_CONFIG = {
  backed: [
    { src: backedBy2, alt: 'dutch crypto investors', width: 60, height: 30 },
    { src: backedBy1, alt: 'blocksolfi', width: 73, height: 9.4 },
    { src: backedBy3, alt: 'a-crypto', height: 43, width: 38 },
    { src: backedBy9, alt: '', width: 75, height: 32 },
    { src: backedBy4, alt: 'OneBlock Labs', width: 74, height: 20 },
    { src: backedBy7, alt: 'crypto era', width: 40, height: 50 },
    { src: backedBy6, alt: 'gem mouse', width: 46, height: 46 },
    { src: backedBy8, alt: '', width: 50, height: 52 },
    { src: backedBy5, alt: 'tccl ventures', width: 51, height: 24 }
  ],
  supported: [
    { src: supportedBy4, alt: 'mads', width: 60, height: 70 },
    { src: supportedBy2, alt: 'coin sixty eight', width: 60, height: 33 },
    { src: supportedBy5, alt: 'omg crypto', width: 66, height: 40 },
    { src: supportedBy3, alt: 'blocksolfi', width: 73, height: 9.4 },
    { src: supportedBy1, alt: '', width: 34, height: 37 },
    { src: supportedBy6, alt: 'C', width: 39, height: 45 }
  ]
}

const PartnersContainer = styled(Box)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 0.5rem;

  @media screen and (max-width: 1280px) {
    max-width: max-content;
  }
`

const StyledDefaultText = styled(Text)`
  font-size: 16px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.01em;
  margin-bottom: 20px;

  @media screen and (max-width: 852px) {
    text-align: center;
  }
`

const Partners = () => {
  const { t } = useTranslation()

  return (
    <Container>
      <StyledDefaultText>{t('Backed By')}</StyledDefaultText>
      <PartnersContainer mb="40px" flexWrap="wrap">
        {PARTNERS_CONFIG.backed.map((image) => (
          <PartnersItem image={image} key={image.src} />
        ))}
      </PartnersContainer>
      <StyledDefaultText>{t('Supported By')}</StyledDefaultText>
      <PartnersContainer flexWrap="wrap">
        {PARTNERS_CONFIG.supported.map((image) => (
          <PartnersItem image={image} key={image.src} />
        ))}
      </PartnersContainer>
    </Container>
  )
}

export default Partners
