import { Image } from '@gravis.finance/uikit'
import React from 'react'
import styled from 'styled-components'

const Container = styled.div<{ clickable: boolean }>`
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 204px;
  height: 107px;
  position: relative;
  border-radius: 20px;
  ${({ clickable }) =>
    clickable
      ? `
    box-shadow: rgba(0, 156, 225, 0.6) 0 0 3px 2px;
    transition: transform 200ms ease-in-out, background 200ms ease-in-out;
    :hover {
      cursor: pointer;
      transform: scale(1.1);
      background: rgba(255, 255, 255, 0.1);
    }
  `
      : ''}

  @media screen and (max-width: 700px) {
    width: 107px;
  }

  @media screen and (max-width: 390px) {
    width: 90px;
    height: 90px;
  }
`

const StyledImage = styled(Image)`
  width: 100%;
  height: 100%;
  object-fit: contain;
  margin-left: 5px;
  margin-right: 5px;

  > img {
    object-fit: contain;
  }
`

type Props = {
  image: {
    marginTop?: number
    height: number
    width: number
    src: string
    alt: string
    link?: string
  }
}

const PartnersItem: React.FC<Props> = ({ image }) => {
  const handleClick = () => {
    if (image.link) window.open(image.link, '_blank')
  }

  return (
    <Container clickable={!!image.link} onClick={handleClick}>
      <StyledImage
        marginTop={image.marginTop}
        height={image.height}
        width={image.width}
        src={image.src}
        alt={image.alt}
      />
    </Container>
  )
}

export default PartnersItem
