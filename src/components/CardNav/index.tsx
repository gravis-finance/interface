import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ButtonMenu, ButtonMenuItem, Heading, Flex } from '@gravis.finance/uikit'

const StyledNav = styled.div`
  margin-bottom: 32px;
  > h1 {
    margin-bottom: 16px;
    margin-top: 0;
    font-size: 48px;
  }
  // > div {
  //   padding: 8px;
  // }
  > div > a {
    height: 40px;
    width: 140px;
    font-size: 14px;
  }

  @media screen and (max-width: 768px) {
    > h1 {
      font-size: 32px;
      margin-top: 0;
    }
  }
  @media screen and (max-width: 685px) {
    display: flex;
    flex-direction: column;
    width: 100%;

    > h1 {
      margin: auto;
      margin-bottom: 24px;
    }

    > div {
      margin: auto;
    }

    > div > a {
      width: 100px;
      font-size: 12px;
      padding: 0 8px;
    }
  }
  @media screen and (max-width: 376px) {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-bottom: 18px;
    > h1 {
      text-align: center;
      margin-bottom: 20px;
    }
    > div {
      align-self: center;
    }
    > div > a {
      width: 90px;
    }
  }

  @media screen and (max-width: 500px) {
    > div {
      flex-wrap: wrap;
      justify-content: center;
      margin: -8px;
    }
    > div > a {
      width: 80px;
      margin: 8px;
    }
  }
`

const Nav = ({ activeIndex = 0 }: { activeIndex?: number }) => {
  const { t } = useTranslation()

  return (
    <Flex alignItems="flex-start">
      <StyledNav>
        <Heading as="h1" size="xl" color="white" mb="40px" mt="20px">
          {t('trade')}
        </Heading>
        <ButtonMenu size="md" variant="dark" activeIndex={activeIndex}>
          <ButtonMenuItem id="swap-nav-link" to="/swap" as={Link}>
            {t('swap')}
          </ButtonMenuItem>
          <ButtonMenuItem id="pool-nav-link" to="/pool" as={Link}>
            {t('mainMenu.liquidity')}
          </ButtonMenuItem>
          <ButtonMenuItem id="migrate-nav-link" to="/migrate" as={Link}>
            {t('mainMenu.migrate')}
          </ButtonMenuItem>
          <ButtonMenuItem id="bridge-nav-link" href={`${process.env.REACT_APP_BRIDGE_URL}/swap`} as="a" style={{ textAlign: 'center' }}>
            {t('Multi-asset Bridge')}
          </ButtonMenuItem>
        </ButtonMenu>
      </StyledNav>
    </Flex>
  )
}

export default Nav
