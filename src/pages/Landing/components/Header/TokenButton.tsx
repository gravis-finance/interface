import { ButtonBase, useModal } from '@gravis.finance/uikit'
import React, { useRef, useState } from 'react'
import styled, { css } from 'styled-components'

import { ArrowBottom } from 'components/Svg'
import { useOnClickOutside } from 'hooks/useOnClickOutside'

import TokenInfo from '../TokenInfo'
import TokenTooltip from '../TokenTooltip'

const StyledArrowBottom = styled(ArrowBottom)<{ rotate: boolean }>`
  margin-left: 10px;

  ${({ rotate }) =>
    rotate
      ? css`
          transform: rotate(180deg);
        `
      : ''}

  path {
    fill: #ffffff;
  }
`
const Overlay = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: #0a0d12;
  opacity: 0.7;
  z-index: 130;
`

const TokenButton = ({
  price,
  icon,
  title,
  right,
  description,
  moreInfo,
  getBuyLink,
  circularSupply,
  marketCap,
  maxSupply,
  isLoading
}) => {
  const [isOpened, setIsOpened] = useState(false)
  const ref = useRef(null)
  const buttonRef = useRef<any>(null)

  const [open, close] = useModal(
    <TokenTooltip
      ref={ref}
      title={title}
      icon={icon}
      price={price}
      description={description}
      circularSupply={circularSupply}
      marketCap={marketCap}
      maxSupply={maxSupply}
      moreInfo={moreInfo}
      right={right}
      getBuyLink={getBuyLink}
      isLoading={isLoading}
    />,
    true
  )
  useOnClickOutside(ref, (event) => {
    if (buttonRef.current?.contains(event.target as Node)) {
      return
    }
    setIsOpened(false)
    close()
  })

  const handleClick = () => {
    setIsOpened((value) => !value)
    if (!isOpened) {
      open()
    } else {
      close()
    }
  }

  return (
    <>
      {isOpened ? <Overlay /> : null}
      <ButtonBase
        ref={buttonRef}
        onClick={handleClick}
        style={{
          minWidth: 120,
          zIndex: isOpened ? 140 : 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <TokenInfo
          isLoading={isLoading}
          value={price}
          image={icon}
          title={title}
        />
        <StyledArrowBottom rotate={isOpened} />
      </ButtonBase>
    </>
  )
}

export default TokenButton
