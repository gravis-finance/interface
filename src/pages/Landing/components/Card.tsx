import { Button, ButtonBase, Flex, Image, Text } from '@gravis.finance/uikit'
import React, { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { ArrowBottom } from 'components/Svg'

const Container = styled.div`
  width: 308px;
  border-radius: 10px;
  background: #151823;
  min-height: calc(100% - 40px);
`

const BigImage = styled(Image)<{ isFullDescription: boolean }>`
  height: ${({ isFullDescription, height }) =>
    isFullDescription ? 0 : height};
  transition: height 200ms ease-in-out;

  img {
    object-fit: cover;
    border-radius: 10px 10px 0 0;
  }
`

const SmallImage = styled(Image)`
  img {
    object-fit: cover;
    border-radius: 50%;
  }
`

const StyledArrowBottom = styled(ArrowBottom)`
  margin-left: 5px;

  path {
    fill: #a4e3ff;
  }
`

const ReadMore = styled(ButtonBase)`
  margin-top: 5px;
  width: 100%;
  display: flex;
  justify-content: start;
  font-size: 13px;
  color: #a4e3ff;

  :hover {
    color: #ffffff;

    path {
      fill: #ffffff;
    }
  }
`

type Props = {
  image: string
  smallImage: string
  name: string
  creator?: string
  description: string
  tradingVolume?: string | JSX.Element
  totalSupply?: number
  url?: string
}

const Card: FC<Props> = ({
  image,
  smallImage,
  name,
  creator,
  description,
  tradingVolume,
  totalSupply,
  url
}) => {
  const { t } = useTranslation()
  const [isFullDescription, setIsFullDescription] = useState(false)

  return (
    <Container>
      <BigImage
        isFullDescription={isFullDescription}
        width={309}
        height={152}
        src={image}
        alt={name}
      />
      <Flex p="25px" flexDirection="column">
        <Flex>
          <SmallImage alt={name} width={48} height={48} src={smallImage} />
          <Flex justifyContent="center" ml="15px" flexDirection="column">
            <Text fontSize="18px" style={{ fontWeight: 700 }}>
              {t(name)}
            </Text>
            {creator ? (
              <Text>
                {t('by')} <span style={{ color: '#a5e2ff' }}>{creator}</span>
              </Text>
            ) : null}
          </Flex>
        </Flex>
        <Flex mt="15px" flexDirection="column" alignItems="start">
          <Text
            fontSize="13px"
            style={{
              maxHeight: isFullDescription ? 'none' : 60,
              overflow: 'hidden',
              position: 'relative',
              whiteSpace: 'pre-line',
              color: '#ffffff',
              letterSpacing: '0.1px',
              opacity: 0.7
            }}
          >
            {t(description)}
            {isFullDescription ? null : (
              <div
                style={{
                  width: 100,
                  height: 16,
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  background:
                    'linear-gradient(90deg, rgba(21, 24, 35, 0) 0%, #151823 100%)'
                }}
              />
            )}
          </Text>
          <ReadMore onClick={() => setIsFullDescription(!isFullDescription)}>
            {isFullDescription ? (
              <>
                {t('Read less')}{' '}
                <StyledArrowBottom style={{ transform: 'rotate(180deg)' }} />
              </>
            ) : (
              <>
                {t('Read more')} <StyledArrowBottom />
              </>
            )}
          </ReadMore>
        </Flex>
        {tradingVolume !== undefined && totalSupply !== undefined ? (
          <Flex mt="15px" mb="25px" style={{ gap: 10 }}>
            <Flex
              justifyContent="center"
              alignItems="center"
              style={{
                width: '100%',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                boxSizing: 'border-box',
                borderRadius: 10
              }}
              flexDirection="column"
            >
              <Text fontSize="11px" color="rgba(255, 255, 255, 0.6)">
                {t('Trading Volume')}
              </Text>
              <Text
                style={{ fontWeight: 700 }}
                fontSize="13px"
                textTransform="uppercase"
              >
                {tradingVolume}
              </Text>
            </Flex>
            <Flex
              justifyContent="center"
              alignItems="center"
              style={{
                width: '100%',
                height: 55,
                borderRadius: 10,
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}
              flexDirection="column"
            >
              <Text fontSize="11px" color="rgba(255, 255, 255, 0.6)">
                {t('Total Supply')}
              </Text>
              <Text
                style={{ fontWeight: 700 }}
                fontSize="13px"
                textTransform="uppercase"
              >
                {totalSupply}
              </Text>
            </Flex>
          </Flex>
        ) : null}
        {url ? (
          <Button
            target="_blank"
            as="a"
            href={url}
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.05)',
              border: 'none',
              boxShadow: 'none'
            }}
          >
            {t('Open')}
          </Button>
        ) : null}
      </Flex>
    </Container>
  )
}

export default Card
