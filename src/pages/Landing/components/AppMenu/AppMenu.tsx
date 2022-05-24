import React, { FC, useEffect, useRef } from 'react'
import styled from 'styled-components'

import EVERVOID_ICON from 'assets/images/landing/menu-projects/evervoid.svg'
import GMART_ICON from 'assets/images/landing/menu-projects/gmart.svg'
import GRAVIS_ICON from 'assets/images/landing/menu-projects/gravis.svg'

import Card from './components/Card'

const PROJECTS_CONFIG = [
  {
    image: EVERVOID_ICON,
    title: 'Evervoid',
    diescription:
      'Free-to-play P2E NFT-based MMO strategy inspired by deep space and sci-fi.',
    link: process.env.REACT_APP_ASTEROID_MINING_URL || ''
  },
  {
    image: GRAVIS_ICON,
    title: 'Gravis Finance',
    diescription:
      'A unique ecosystem of Evervoid free-to-play P2E strategy, Gmart NFT marketplace for game assets, and Gswap multi-chain DEX with 1-click liquidity migration and ERC20 & NFT bridge.',
    link: process.env.REACT_APP_HOME_URL || ''
  },
  {
    image: GMART_ICON,
    title: 'Gmart',
    diescription:
      'The first NFT marketplace focused solely on in-game assets. Built-in smart analytics for NFT portfolio.',
    link: process.env.REACT_APP_GMART_URL || ''
  }
]

const Wrapper = styled.div`
  z-index: 100;
  height: 100vh;
  width: 100%;
  position: fixed;
  overflow: auto;
`

const Content = styled.div`
  top: -100%;
  right: 45px;
  width: fit-content;
  position: absolute;
  display: flex;
  gap: 10px;
  background: #24272e;
  backdrop-filter: blur(200px);
  border-radius: 20px;
  padding: 25px;
  z-index: 100;
  transition: opacity 400ms ease-in-out, top 400ms ease-in-out;
  opacity: 0;

  @media screen and (max-width: 1360px) {
    flex-direction: column;
  }

  @media screen and (max-width: 700px) {
    top: 70px;
    width: 100%;
    right: 50%;
    transform: translateX(50%);
  }
`

const Corner = styled.div`
  position: absolute;
  right: 25px;
  top: -10px;
  transform: rotate(45deg);
  width: 20px;
  height: 20px;
  background: #24272e;

  @media screen and (max-width: 700px) {
    display: none;
  }
`

const StyledCard = styled(Card)`
  width: 395px;

  @media screen and (max-width: 700px) {
    width: 100%;
  }
`

type Props = {
  isOpened?: boolean
  onClose: () => void
  onDismiss?: () => void
}

const AppMenu: FC<Props> = ({ onClose, onDismiss, isOpened }) => {
  const ref = useRef<HTMLDivElement>(null)
  const onWrapperClick = () => {
    if (onDismiss) {
      onDismiss()
      onClose()
    }
  }

  useEffect(() => {
    const element: any = ref.current
    if (!element) {
      return
    }

    if (!isOpened) element.style = 'opacity: 0;'
    else {
      setTimeout(() => {
        element.style = 'opacity: 1; top: 90px;'
      })
    }
  }, [isOpened])

  return (
    <Wrapper onClick={onWrapperClick}>
      <Content ref={ref}>
        <Corner />
        {PROJECTS_CONFIG.map((item) => (
          <StyledCard key={item.title} {...item} />
        ))}
      </Content>
    </Wrapper>
  )
}

export default AppMenu
