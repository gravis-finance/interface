import { Box, Flex, Link, Text } from '@gravis.finance/uikit'
import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import useMediaQuery from 'hooks/useMediaQuery'

import Socials, { SOCIALS_LIST } from './Socials'

const Wrapper = styled(Box).attrs((props) => ({ zIndex: 2, ...props }))`
  width: 100%;
  display: flex;
  padding: 60px;
  background: rgba(255, 255, 255, 0.03);

  @media screen and (max-width: 770px) {
    padding: 30px 20px;
  }
`

const Content = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  column-gap: 50px;
  row-gap: 30px;

  @media screen and (max-width: 1170px) {
    justify-content: center;
    flex-wrap: wrap;
  }
`

const Footer = () => {
  const { t } = useTranslation()
  const isSmall = useMediaQuery('(max-width: 470px)')

  return (
    <Wrapper>
      <Content>
        <Flex style={{ height: 15 }}>
          <Link
            fontSize="14px"
            target="_blank"
            style={{ fontWeight: 500, opacity: 0.7, fontFamily: 'Inter' }}
            href="https://drive.google.com/file/d/1vWi8Zx-TD190to9LT8HP9Dhy5_IIj840/view?usp=sharing"
          >
            {t('Privacy & Policy')}
          </Link>
          <div
            style={{
              width: 2,
              background: '#ffffff',
              opacity: 0.1,
              margin: '0 20px'
            }}
          />
          <Link
            fontSize="14px"
            target="_blank"
            style={{ fontWeight: 500, opacity: 0.7, fontFamily: 'Inter' }}
            href="https://drive.google.com/file/d/1p5n2HUo3VNUhhbr60cKkjP_8dBHbMO4h/view?usp=sharing"
          >
            {t('Terms of Use')}
          </Link>
        </Flex>
        <Socials size={isSmall ? 50 : 60} list={SOCIALS_LIST} />
        <Text
          fontSize="14px"
          style={{ textAlign: 'center', fontFamily: 'Inter' }}
        >
          {t('All rights reserved. © 2022 Gswap')}
        </Text>
      </Content>
    </Wrapper>
  )
}

export default Footer
