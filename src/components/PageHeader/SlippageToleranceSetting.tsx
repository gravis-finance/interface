import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { ButtonMenu, ButtonMenuItem, Flex, Input, Text } from '@gravis.finance/uikit'
import { useTranslation } from 'react-i18next'
import { useUserSlippageTolerance } from 'state/user/hooks'
import QuestionHelper from '../QuestionHelper'

const MAX_SLIPPAGE = 5000
const RISKY_SLIPPAGE_LOW = 50
const RISKY_SLIPPAGE_HIGH = 500

const Field = styled.div`
  display: flex;
  align-items: center;

  & > ${Input} {
    max-width: 325.7px;
    width: 100%;
  }

  & > ${Text} {
    width: 52px;
    font-size: 14px;
    margin-left: 18px;

`

const Options = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;

  & > div {
    width: 100%;
    height: auto;
    &:first-child {
      flex-basis: 90%;
      height: 80px;
      align-items: center;
      display: flex;
      margin-right: 8px;
      background: #262626;
      border: 1px solid #2e2e2e;
      box-shadow: 4px 4px 20px rgba(0, 0, 0, 0.4), -4px -4px 20px rgba(255, 255, 255, 0.05);
      border-radius: 49px;
      padding: 16px;
    }
  }

  @media screen and (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
  }
`

const StyledButtonMenu = styled(ButtonMenu)`
  padding-top: 8px;
  padding-bottom: 8px;
`

const StyledButtonItem = styled(ButtonMenuItem)<{ isActive?: boolean }>`
  padding: 6px 20px;
  width: 100%;
  background: linear-gradient(90.28deg, #292929 0%, #242424 100%);
  border-radius: 41px;
  height: 40px !important;
  border: 1px solid transparent !important;
  box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.4), -4px -4px 12px rgba(255, 255, 255, 0.05);
  ${({ isActive }) =>
    isActive
      ? 'height: 46px !important; box-shadow: inset 0px -2px 0px rgba(129, 129, 129, 0.15), inset 0px 4px 25px rgba(0, 0, 0, 0.25), inset 0px 4px 25px rgba(0, 0, 0, 0.25) !important;'
      : ''}

  ${({ isActive }) =>
    isActive
      ? `
  :hover {
    background: linear-gradient(90.28deg, #242424 0%, #202020 100%) !important;
    border: 1px solid #2E2E2E !important;
    box-shadow: inset 0px -2px 0px rgba(129, 129, 129, 0.15), inset 0px 4px 25px rgba(0, 0, 0, 0.25), inset 0px 4px 25px rgba(0, 0, 0, 0.25) !important;
  }`
      : `
    :hover {
      background: linear-gradient(90.28deg, #242424 0%, #202020 100%) !important;
      border: 1px solid transparent !important;
      box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.4), -4px -4px 12px rgba(255, 255, 255, 0.05) !important;
  }
  `}
  
  :active {
    height: 46px !important;
    background: linear-gradient(90.28deg, #292929 0%, #242424 100%), linear-gradient(90.28deg, #292929 0%, #242424 100%),
      linear-gradient(90.28deg, #292929 0%, #242424 100%) !important;
    border: 1px solid #2e2e2e !important;
    box-sizing: border-box !important;
    box-shadow: inset 0px -2px 0px rgba(129, 129, 129, 0.15), inset 0px 4px 25px rgba(0, 0, 0, 0.25),
      inset 0px 4px 25px rgba(0, 0, 0, 0.25) !important;
  }
`

const Label = styled.div`
  align-items: center;
  display: flex;
  margin-bottom: 12px;
  > div {
    letter-spacing: -0.1px;
  }
  @media screen and (max-width: 480px) {
    margin-bottom: 8px;
  }
`

const PercentInputWrapper = styled.div`
  margin-left: 10px;

  @media screen and (max-width: 480px) {
    margin-left: 0;
    margin-top: 18px;
  }
`

const predefinedValues = [
  { label: '0,1%', value: 0.1 },
  { label: '0,5%', value: 0.5 },
  { label: '1%', value: 1 },
]

const SlippageToleranceSettings = () => {
  const [userSlippageTolerance, setUserslippageTolerance] = useUserSlippageTolerance()
  const [value, setValue] = useState(userSlippageTolerance / 100)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = evt.target
    setValue(parseFloat(inputValue))
  }

  const { t } = useTranslation()

  // Updates local storage if value is valid
  useEffect(() => {
    try {
      const rawValue = value * 100
      if (!Number.isNaN(rawValue) && rawValue > 0 && rawValue < MAX_SLIPPAGE) {
        setUserslippageTolerance(rawValue)
        setError(null)
      } else {
        setError('Enter a valid slippage percentage')
      }
    } catch {
      setError('Enter a valid slippage percentage')
    }
  }, [value, setError, setUserslippageTolerance])

  // Notify user if slippage is risky
  useEffect(() => {
    if (userSlippageTolerance < RISKY_SLIPPAGE_LOW) {
      setError(t('errorMessages.transactionMayFail'))
    } else if (userSlippageTolerance > RISKY_SLIPPAGE_HIGH) {
      setError(t('errorMessages.transactionMayFail'))
    }
  }, [t, userSlippageTolerance, setError])

  const getActiveIndex = () => {
    const values = predefinedValues.map((_value) => _value.value)
    return values.indexOf(value)
  }

  const activeIndex = getActiveIndex()

  return (
    <>
      <Label>
        <Text style={{ fontWeight: 600 }}>{t('slippageTolerance')}</Text>
        <QuestionHelper text={t('questionHelperMessages.transactionRevert')} />
      </Label>

      <Options>
        <StyledButtonMenu
          size="sm"
          variant="primary"
          activeIndex={activeIndex}
          onClick={(index) => {
            setValue(predefinedValues[index].value)
          }}
        >
          {predefinedValues.map((valueElement, index) => (
            <StyledButtonItem
              isActive={index === activeIndex}
              key={valueElement.value}
              variant={value === valueElement.value ? 'primary' : 'tertiary'}
              data-id={`slippage-${index}-percent-button`}
            >
              {valueElement.label}
            </StyledButtonItem>
          ))}
        </StyledButtonMenu>
        <PercentInputWrapper>
          <Flex alignItems="center">
            <Field style={{ width: '100%' }}>
              <Input
                type="number"
                scale="md"
                step={0.1}
                min={0.1}
                placeholder="5%"
                value={value}
                onChange={handleChange}
                isWarning={error !== null}
                style={{ height: '48px' }}
                data-id="percentage-input"
              />
              <Text color="#909090" fontSize="18px" style={{ width: 'auto' }}>
                %
              </Text>
            </Field>
          </Flex>
        </PercentInputWrapper>
      </Options>
      <Text mt="8px" color="failure" style={error ? { opacity: 1 } : { opacity: 0 }}>
        {error || 'No error'}
      </Text>
    </>
  )
}

export default SlippageToleranceSettings
