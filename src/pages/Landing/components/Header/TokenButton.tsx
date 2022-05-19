import { ButtonBase, useModal } from '@gravis.finance/uikit'
import React, { useReducer } from 'react'
import styled, { css } from 'styled-components'

import { ArrowBottom } from 'components/Svg'

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
  const [isOpened, toggleOpened] = useReducer((state) => !state, false)
  const [open, close] = useModal(
    <TokenTooltip
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
    />
  )

  const handleClick = () => {
    toggleOpened()
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
