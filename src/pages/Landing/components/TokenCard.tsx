import { Flex, Image, Text } from '@gravis.finance/uikit'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import { Dots } from 'components/swap/styleds'
import { useActiveWeb3React } from 'hooks'
import numberWithSpaces from 'utils/numberWithSeparator'

import Button from './Button'
import DataItem from './DataItem'

const Container = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 25px;
  padding: 35px;

  .description {
    font-weight: 600;
    opacity: 0.7;
    text-align: start;
  }

  @media screen and (max-width: 1200px) {
    .description {
      font-size: 14px;
    }
  }
`

const LastRow = styled.div`
  display: flex;
  gap: 25px;
  margin-top: 40px;

  .price {
    display: none;
  }

  @media screen and (max-width: 1200px) {
    margin-top: 30px;
    ${Button} {
      width: 100%;
    }

    .price {
      display: block;
    }
  }
`

const PriceWrapper = styled.div`
  @media screen and (max-width: 1200px) {
    display: none;
  }
`

const DataWrapper = styled.div`
  display: flex;
  gap: 25px 40px;
  margin-top: 35px;
  flex-wrap: wrap;

  @media screen and (max-width: 1200px) {
    justify-content: start;
  }
`

type Props = {
  className?: string
  icon: string
  title: string
  description: string
  circularSupply: string
  marketCap?: string
  maxSupply?: string
  price: string
  getBuyLink: (network: number) => string
  isLoading: boolean
}

const TokenCard = ({
  className,
  icon,
  title,
  description,
  circularSupply,
  marketCap,
  maxSupply,
  price,
  getBuyLink,
  isLoading
}: Props) => {
  const { t } = useTranslation()
  const history = useHistory()
  const { chainId } = useActiveWeb3React()

  return (
    <Container className={className}>
      <Flex className="header" justifyContent="start" alignItems="center">
        <Image width={65} height={65} src={icon} />
        <Text ml="25px" style={{ fontWeight: 700 }} fontSize="30px">
          {t(title)}
        </Text>
      </Flex>
      <Text className="description" mt="10px" fontSize="16px">
        {t(description)}
      </Text>
      <DataWrapper className="data-wrapper">
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
              `$${numberWithSpaces(parseInt(marketCap))}`
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
      <LastRow>
        <Button
          style={{ minWidth: 130 }}
          onClick={() => (chainId ? history.push(getBuyLink(chainId)) : null)}
          data-id={`${title}-buy-button`}
        >
          {t('Buy ')}
          {!isLoading ? (
            <span style={{ marginLeft: 5 }} className="price">
              {' '}
              {t('for')} ${price}
            </span>
          ) : null}
        </Button>
        <PriceWrapper>
          <DataItem
            title={
              !isLoading && price ? (
                `$${numberWithSpaces(parseFloat(price))}`
              ) : (
                <Dots />
              )
            }
            description="Current price"
          />
        </PriceWrapper>
      </LastRow>
    </Container>
  )
}

export default TokenCard
