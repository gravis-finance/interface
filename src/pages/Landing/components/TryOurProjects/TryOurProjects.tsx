import { Flex, Text } from '@gravis.finance/uikit'
import React from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import EVERVOID_CARD_IMAGE from 'assets/images/landing/evervoid-card-background.webp'
import GMART_CARD_MOBILE_IMAGE from 'assets/images/landing/gmart-card-background-mobile.webp'
import GMART_CARD_IMAGE from 'assets/images/landing/gmart-card-background.webp'
import EVERVOID_ICON from 'assets/images/landing/projects/evervoid.svg'
import GMART_ICON from 'assets/images/landing/projects/gmart.svg'

import Card from './Card'

const CollectionWrapper = styled.div`
  display: flex;
  margin-top: 35px;
  gap: 15px;

  justify-content: center;
  align-items: center;
  padding: 0 20px;

  > div {
    max-width: 635px;
  }

  @media (max-width: 1260px) {
    flex-direction: column;
  }

  @media (max-width: 620px) {
    row-gap: 120px;
  }
`

const OUR_PROJECTS_CONFIG = [
  {
    logo: {
      src: GMART_ICON,
      alt: 'Gmart'
    },
    image: {
      src: GMART_CARD_IMAGE,
      alt: 'Starship'
    },
    description: 'The first NFT marketplace focused solely on in-game assets',
    buttonText: 'Open Gmart',
    url: process.env.REACT_APP_GMART_URL || '',
    hover: css`
      background: radial-gradient(100% 100% at 50% 0%, #2aa6ff 0%, #004ee6 100%),
        linear-gradient(104.88deg, #0092e0 0%, #0054d2 100%);

      > img {
        height: 120%;
        top: 0;
        right: 0;
        transform: none;
      }

      @media screen and (max-width: 620px) {
        > img {
          height: auto;
          width: 120%;
          top: auto;
          left: 0;
          transform: none;
        }
      }
    `,
    styles: css`
      > div > div:first-of-type {
        width: 160px;
      }
      > img {
        transition: all 0.3s ease-in-out;
        right: 0;
      }

      @media screen and (max-width: 620px) {
        overflow: hidden;

        > img {
          top: auto;
          max-width: none;
          height: auto;
          width: 100%;
          left: 0;
          bottom: 0;
          content: url(${GMART_CARD_MOBILE_IMAGE});
        }
      }
    `
  },
  {
    logo: {
      src: EVERVOID_ICON,
      alt: 'Evervoid'
    },
    image: {
      src: EVERVOID_CARD_IMAGE,
      alt: 'Starship'
    },
    description:
      'Free-to-play P2E NFT-based\n MMO strategy inspired by deep\n space and sci-fi',
    buttonText: 'Open Evervoid',
    url: process.env.REACT_APP_ASTEROID_MINING_URL || '',
    hover: css`
      background: radial-gradient(
        163.8% 565.84% at 145.09% -48.62%,
        #d4ea62 0%,
        #ed711e 48.75%,
        #e9295c 100%
      );

      > img {
        top: -30px;
        height: 120%;
      }

      @media screen and (max-width: 620px) {
        > img {
          top: auto;
          bottom: -100px;
          height: 360px;
          right: -40px;
        }
      }

      @media screen and (max-width: 510px) {
        > img {
          right: -50px;
          height: 300px;
        }
      }

      @media screen and (max-width: 375px) {
        > img {
          right: -50px;
          height: 250px;
        }
      }
    `,
    styles: css`
      > img {
        transition: all 0.3s ease-in-out;
        right: -100px;
      }

      @media screen and (max-width: 620px) {
        overflow: visible;

        > img {
          top: auto;
          bottom: -100px;
          height: 340px;
          right: -60px;
        }
      }

      @media screen and (max-width: 510px) {
        > img {
          right: -50px;
          height: 280px;
        }
      }

      @media screen and (max-width: 375px) {
        > img {
          height: 240px;
        }
      }
    `
  }
]

const Title = styled(Text)`
  text-align: center;
  font-weight: 700;
  letter-spacing: -0.02em;
  font-size: 65px;

  @media (max-width: 700px) {
    font-size: 40px;
  }
`

const TryOurProjects = () => {
  const { t } = useTranslation()

  return (
    <Flex py="120px" justifyContent="center">
      <Flex style={{ maxWidth: 1280, width: '100%' }} flexDirection="column">
        <Title>{t('Try our other products')}</Title>
        <CollectionWrapper>
          {OUR_PROJECTS_CONFIG.map((item) => (
            <Card key={item.buttonText} {...item} />
          ))}
        </CollectionWrapper>
      </Flex>
    </Flex>
  )
}

export default TryOurProjects
