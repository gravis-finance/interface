import { Flex, Text } from '@gravis.finance/uikit'
import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import AURORA_ICON from 'assets/images/landing/chains/aurora.svg'
import AVALANCHE_ICON from 'assets/images/landing/chains/avalanche.svg'
import BINANCE_ICON from 'assets/images/landing/chains/binance.svg'
import HUOBI_ICON from 'assets/images/landing/chains/huobi.svg'
import NEAR_ICON from 'assets/images/landing/chains/near.svg'
import POLKADOT_ICON from 'assets/images/landing/chains/polkadot.svg'
import POLYGON_ICON from 'assets/images/landing/chains/polygon.svg'
import SOLANA_ICON from 'assets/images/landing/chains/solana.svg'

const StyledImage = styled.img`
  height: 35px;
  padding: 0 20px;
  background: rgba(255, 255, 255, 0.1);
  min-width: ${({ width }) => width}px;

  border-radius: 41px;
`

const PoweredByWrapper = styled.div`
  position: absolute;
  padding: 30px;
  bottom: 0;
  width: 100%;
  z-index: 1;
  overflow-x: auto;

  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;

  @media screen and (max-width: 860px) {
    padding: 15px;
  }
`

const PoweredByViewWrapper = styled.div`
  display: flex;
  justify-content: center;

  @media screen and (max-width: 1320px) {
    justify-content: start;
  }
`

const POWERED_BUY_CONFIG = [
  { image: BINANCE_ICON, alt: 'Binance' },
  { image: HUOBI_ICON, alt: 'Huobi' },
  { image: POLYGON_ICON, alt: 'Polygon' }
]

const COMING_SOON_CONFIG = [
  {
    image: AURORA_ICON,
    alt: 'Aurora',
    style: { background: 'none', padding: 0 }
  },
  { image: SOLANA_ICON, alt: 'Solana', width: 132 },
  { image: NEAR_ICON, alt: 'Near', width: 96 },
  { image: POLKADOT_ICON, alt: 'Polkadot', width: 104 },
  {
    image: AVALANCHE_ICON,
    alt: 'Avalanche',
    width: 122,
    style: {
      padding: '0 10px'
    }
  }
]

const PoweredBy = () => {
  const { t } = useTranslation()

  return (
    <PoweredByWrapper>
      <PoweredByViewWrapper>
        <Flex alignItems="center" style={{ gap: 5, minWidth: 'max-content' }}>
          <Text
            style={{ fontWeight: 600, whiteSpace: 'nowrap' }}
            mr="10px"
            fontSize="14px"
          >
            {t('Powered by')}
          </Text>
          {POWERED_BUY_CONFIG.map(({ image, alt }) => (
            <img key={image} style={{ height: 35 }} src={image} alt={alt} />
          ))}
        </Flex>
        <Flex
          ml="50px"
          alignItems="center"
          style={{ gap: 5, minWidth: 'max-content' }}
        >
          <Text
            style={{ fontWeight: 600, whiteSpace: 'nowrap' }}
            mr="10px"
            fontSize="14px"
          >
            {t('Coming soon')}
          </Text>
          {COMING_SOON_CONFIG.map(({ image, alt, width, style }) => (
            <StyledImage
              style={style}
              key={image}
              src={image}
              alt={alt}
              width={width}
            />
          ))}
        </Flex>
      </PoweredByViewWrapper>
    </PoweredByWrapper>
  )
}

export default PoweredBy
