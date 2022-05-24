import { Flex, Text } from '@gravis.finance/uikit'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { ArrowBottom } from 'components/Svg'

import Socials, { SOCIALS_LIST } from '../Socials'
import MenuItemBase from './MenuItem'
import OurTokens from './OurTokens'
import MENU_ITEMS_CONFIG from './menu-items-config'

const Container = styled.div`
  display: flex;
  position: fixed;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  touch-action: none;
  background-color: #080a15;
  padding: 20px;
  padding-top: 100px;
  overflow-y: scroll;
  z-index: 90;
`

const MenuItemButtonWrapper = styled(MenuItemBase)`
  height: 60px;
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  :hover {
    div {
      color: rgba(255, 255, 255, 0.8);
    }

    path {
      fill: rgba(255, 255, 255, 0.8);
    }
  }

  :active {
    ${Text} {
      color: rgba(255, 255, 255, 0.8);
    }

    path {
      fill: rgba(255, 255, 255, 0.8);
    }
  }
`

const StyledArrowBottom = styled(ArrowBottom)`
  transform: rotate(-90deg);

  path {
    fill: #787e91;
  }
`

const MenuItem = ({ link, title, onClick }) => {
  const { t } = useTranslation()

  return (
    <MenuItemButtonWrapper onClick={onClick} href={`#${link}`}>
      <Flex alignItems="center">
        <Text ml="14px" style={{ fontWeight: 600 }}>
          {t(title)}
        </Text>
      </Flex>
      <StyledArrowBottom />
    </MenuItemButtonWrapper>
  )
}

function disableScrolling() {
  const x = window.scrollX
  const y = window.scrollY
  window.document.body.style.overflowY = 'hidden'
  window.onscroll = () => window.scrollTo(x, y)
}

function enableScrolling() {
  window.document.body.style.overflowY = 'scroll'
  window.onscroll = () => null
}

const MobileMenu = ({ onItemClick }) => {
  useEffect(() => {
    disableScrolling()

    return () => {
      enableScrolling()
    }
  }, [])

  const handleClick = () => {
    enableScrolling()
    onItemClick()
  }

  return (
    <Container>
      <Flex
        style={{ maxWidth: 450, width: '100%', position: 'relative' }}
        flexDirection="column"
      >
        <Flex flexDirection="column">
          <OurTokens />
        </Flex>
        <Flex flexDirection="column">
          {MENU_ITEMS_CONFIG.map((props) => (
            <MenuItem onClick={handleClick} {...props} />
          ))}
        </Flex>
        <Socials
          style={{ order: 0, marginTop: 2, maxWidth: 'none' }}
          size={45}
          list={SOCIALS_LIST}
        />
      </Flex>
    </Container>
  )
}

export default MobileMenu
