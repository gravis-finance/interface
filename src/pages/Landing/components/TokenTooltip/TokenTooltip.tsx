import { Flex, Image, Text } from '@gravis.finance/uikit'
import React, { forwardRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import { Dots } from 'components/swap/styleds'
import { useActiveWeb3React } from 'hooks'
import numberWithSpaces from 'utils/numberWithSeparator'

import Button from '../Button'
import DataItem from '../DataItem'
import MoreInfoItem from '../MoreInfoItem'

const Card = styled.div<{ right }>`
  display: flex;
  background: #24272e;
  backdrop-filter: blur(200px);
  padding: 40px;
  z-index: 10;
  position: fixed;
  top: 100px;
  right: ${({ right }) => right}px;
  max-width: 960px;
  border-radius: 20px;

  .description {
    opacity: 0.7;
    font-weight: 600;
  }
`

const LastRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
  padding-left: 40px;
  border-left: 1px solid rgba(255, 255, 255, 0.05);

  @media screen and (max-width: 1200px) {
    ${Button} {
      width: 100%;
    }
  }
`

const DataWrapper = styled.div`
  display: flex;
  gap: 25px 40px;
  margin-top: 35px;
  flex-wrap: wrap;

  .description {
    font-size: 14px;
  }

  @media screen and (max-width: 1200px) {
    justify-content: start;
  }
`

const Square = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  background: #24272e;
  right: 150px;
  top: -10px;
  transform: rotate(45deg);
`

const defaultOnDismiss = () => null

type Props = {
  onDismiss?: () => unknown
  icon: string
  title: string
  description: string
  circularSupply: string
  marketCap: string
  maxSupply: string
  price: string
  moreInfo: any[]
  right: number
  getBuyLink: (network: number) => string
  isLoading: boolean
}

const TokenTooltip = forwardRef(
  (
    {
      onDismiss = defaultOnDismiss,
      icon,
      title,
      description,
      circularSupply,
      marketCap,
      maxSupply,
      price,
      moreInfo,
      getBuyLink,
      right,
      isLoading
    }: Props,
    ref: any
  ) => {
    const { t } = useTranslation()
    const { chainId } = useActiveWeb3React()
    const history = useHistory()

    const handleClick = () => {
      if (!chainId) {
        return
      }

      history.push(getBuyLink(chainId))
      onDismiss()
    }

    return (
      <Card ref={ref} right={right}>
        <Flex pr="40px" flexDirection="column">
          <Flex className="header" alignItems="center">
            <Image width={65} height={65} src={icon} />
            <Text ml="25px" style={{ fontWeight: 700 }} fontSize="30px">
              {t(title)}
            </Text>
          </Flex>
          <Text className="description" mt="15px" fontSize="16px">
            {t(description)}
          </Text>
          <DataWrapper>
            <DataItem
              title={
                !isLoading && circularSupply ? (
                  numberWithSpaces(parseInt(circularSupply))
                ) : (
                  <Dots />
                )
              }
              description={t('Circulating supply')}
            />
            <DataItem
              title={
                !isLoading && marketCap ? (
                  `$${numberWithSpaces(marketCap)}`
                ) : (
                  <Dots />
                )
              }
              description={t('Market cap')}
            />
            {maxSupply ? (
              <DataItem title={maxSupply} description={t('Max total supply')} />
            ) : null}
          </DataWrapper>
        </Flex>
        <LastRow>
          <Button
            style={{ minWidth: 300, width: '100%' }}
            onClick={handleClick}
          >
            {t('Buy')}
            {isLoading || !price ? null : (
              <span style={{ marginLeft: 5 }}>
                {t('for')} ${price}
              </span>
            )}
          </Button>
          <Flex mt="5px" flexDirection="column">
            <Text mb="20px" style={{ fontWeight: 700 }}>
              {t('More info on')}
            </Text>
            <Flex style={{ gap: '20px 15px' }} flexWrap="wrap">
              {moreInfo?.map((item) => (
                <MoreInfoItem
                  link={item.getLink(chainId)}
                  key={item.title}
                  {...item}
                />
              ))}
            </Flex>
          </Flex>
        </LastRow>
        <Square />
      </Card>
    )
  }
)

export default TokenTooltip
