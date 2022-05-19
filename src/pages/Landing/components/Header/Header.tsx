import {
  BurgerIcon,
  CloseIcon,
  Flex,
  Image,
  Button as UikitButton,
  useModal
} from '@gravis.finance/uikit'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import GSWAP_ICON from 'assets/images/landing/projects/gswap.svg'
import { ArrowBottom } from 'components/Svg'
import useGetTokensData from 'hooks/useGetTokensData'
import useMediaQuery from 'hooks/useMediaQuery'

import TOKEN_INFO_CONFIG from '../../token-info-config'
import AppMenu from '../AppMenu'
import Button from '../Button'
import { getMarketCap } from '../utils'
import MenuItemBase from './MenuItem'
import MobileMenu from './MobileMenu'
import TokenButton from './TokenButton'
import MENU_ITEMS_CONFIG from './menu-items-config'

const Container = styled.div`
  padding: 10px 40px;
  display: flex;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 100;
  height: 70px;
  background: #0f131d;
  backdrop-filter: blur(500px);

  @media screen and (max-width: 620px) {
    padding: 10px 20px;
  }
`

const MenuButton = styled(UikitButton)`
  display: none;
  margin-right: 20px;
  background: rgba(255, 255, 255, 0.1) !important;
  border-radius: 41px;
  border: none;
  padding: 0;
  height: 35px;
  min-width: 35px;
  box-shadow: none;

  :hover {
    filter: brightness(0.7);
  }

  @media screen and (max-width: 1080px) {
    display: block;
  }
`

const StyledImage = styled(Image)`
  min-width: ${({ width }) => width}px;
`

const Overlay = styled.div`
  z-index: 10;
  height: 100vh;
  background: #03060c;
  opacity: 0.85;
  position: fixed;
  width: 100%;
`

const MenuItem = styled(MenuItemBase)<{ active?: boolean }>`
  font-size: 12px;
  font-weight: 500;
  opacity: ${(props) => (props.active ? 1 : 0.5)};
  color: #ffffff;
  transition: opacity 0.3s;
  letter-spacing: -0.02em;

  &:hover,
  &:active {
    opacity: 1;
  }
`

const MenuItemContainer = styled.div`
  display: flex;
  gap: 25px;
  margin-left: 55px;

  @media screen and (max-width: 1080px) {
    display: none;
  }
`

const TOKEN_RIGHT_MARGIN = [190, 50]

const Header = () => {
  const { t } = useTranslation()
  const [isOpened, setIsOpened] = useState(false)
  const [open, close, update] = useModal(
    <AppMenu onClose={() => setIsOpened(false)} />
  )
  const [activeLink, setActiveLink] = useState(MENU_ITEMS_CONFIG[0].link)
  const isSmall = useMediaQuery('(max-width: 1080px)')
  const [isSearchOpened] = useState(false)
  const [isMenuOpened, setIsMenuOpened] = useState(false)
  const { isLoading: isTokenDataLoading, data: tokenData } = useGetTokensData()

  const onAppClick = () => {
    if (isOpened) {
      update({ isOpened: false })
      setIsOpened(false)
      setTimeout(close, 400)
    } else {
      update({ isOpened: true })
      setIsOpened(true)
      open()
    }
  }

  const handleMenuClose = () => {
    setIsMenuOpened(false)
  }

  const handleMenuOpen = () => {
    setIsMenuOpened(true)
  }

  return (
    <>
      <Container>
        <Flex alignItems="center" justifyContent="space-between" width="100%">
          <Flex alignItems="center">
            {isMenuOpened ? (
              <MenuButton aria-label="menu" onClick={handleMenuClose}>
                <CloseIcon />
              </MenuButton>
            ) : (
              <MenuButton aria-label="menu" onClick={handleMenuOpen}>
                <BurgerIcon />
              </MenuButton>
            )}
            <StyledImage
              width={105}
              height={29}
              src={GSWAP_ICON}
              alt="Gswap logo"
            />
            <MenuItemContainer>
              {MENU_ITEMS_CONFIG.map(({ title, link }) => (
                <MenuItem
                  active={activeLink === `#${link}`}
                  onActive={setActiveLink}
                  key={link}
                  href={`#${link}`}
                >
                  {t(title)}
                </MenuItem>
              ))}
            </MenuItemContainer>
          </Flex>
          <Flex alignItems="center">
            {!isSmall ? (
              <Flex style={{ gap: 25 }} mr="40px">
                {TOKEN_INFO_CONFIG.map((props, index) => {
                  const tokenDataItem = tokenData
                    ? tokenData[props.title.toLocaleLowerCase()]
                    : null

                  return (
                    <TokenButton
                      {...props}
                      key={props.title}
                      isLoading={isTokenDataLoading}
                      right={TOKEN_RIGHT_MARGIN[index]}
                      marketCap={getMarketCap(
                        tokenDataItem?.total,
                        tokenDataItem?.price
                      )}
                      price={tokenDataItem?.price}
                      circularSupply={tokenDataItem?.live_count}
                    />
                  )
                })}
              </Flex>
            ) : null}

            <Button
              style={{
                fontSize: 13,
                padding: '0 15px',
                height: 35,
                zIndex: 120
              }}
              onClick={onAppClick}
            >
              {t('Apps')}
              <ArrowBottom />
            </Button>
          </Flex>
        </Flex>
      </Container>
      {isMenuOpened ? <MobileMenu onItemClick={handleMenuClose} /> : null}
      {isSearchOpened ? <Overlay /> : null}
    </>
  )
}

export default Header
