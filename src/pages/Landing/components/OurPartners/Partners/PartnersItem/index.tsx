import { Image } from '@gravis.finance/uikit'
import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 204px;
  height: 107px;
  position: relative;
  border-radius: 20px;

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
`

type Props = {
  image: {
    height: number
    width: number
    src: string
    alt: string
  }
}

const PartnersItem: React.FC<Props> = ({ image }) => {
  return (
    <Container>
      <StyledImage
        height={image.height}
        width={image.width}
        src={image.src}
        alt={image.alt}
      />
    </Container>
  )
}

export default PartnersItem
