import React, { useCallback, useEffect } from 'react'
// import { useSpring } from 'react-spring/web'
import { CloseIcon } from '@gravis.finance/uikit'
import styled from 'styled-components'
// import { animated } from 'react-spring'
import { PopupContent } from '../../state/application/actions'
import { useRemovePopup } from '../../state/application/hooks'
import ListUpdatePopup from './ListUpdatePopup'
import TransactionPopup from './TransactionPopup'

export const StyledClose = styled.div`
  position: absolute;
  right: 10px;
  top: 10px;
  width: 24px;
  height: 24px;
  background: linear-gradient(90.28deg, #292929 0%, #242424 100%);
  box-sizing: border-box;
  box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.4), -4px -4px 12px rgba(255, 255, 255, 0.05);
  border-radius: 45px;
  display: flex;

  > svg {
    margin: auto;
  }

  :hover {
    cursor: pointer;
    background: linear-gradient(90.28deg, #242424 0%, #202020 100%);
    box-sizing: border-box;
    box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.4), -4px -4px 12px rgba(255, 255, 255, 0.05);
  }
`
export const Popup = styled.div<{ type?: boolean }>`
  display: inline-block;
  width: 100%;
  padding: 1em;
  // background-color: ${({ theme }) => theme.colors.primary};
  background-color: #292929;
  position: relative;
  border-radius: 6px;
  padding: 20px;
  padding-right: 35px;
  overflow: hidden;
  max-width: 360px;
  border-left: 6px solid ${({ type }) => (type ? '#1EA76D' : '#FF4D00')};

  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 290px;
  }
`
// const Fader = styled.div`
//   position: absolute;
//   bottom: 0px;
//   left: 0px;
//   width: 100%;
//   height: 2px;
//   // background-color: ${({ theme }) => theme.colors.tertiary};
//   background-color: rgba(255, 255, 255, 0.05);
// `

// const AnimatedFader = animated(Fader)

export default function PopupItem({
  removeAfterMs,
  content,
  popKey,
}: {
  removeAfterMs: number | null
  content: PopupContent
  popKey: string
}) {
  const removePopup = useRemovePopup()
  const removeThisPopup = useCallback(() => removePopup(popKey), [popKey, removePopup])
  useEffect(() => {
    if (removeAfterMs === null) return undefined

    const timeout = setTimeout(() => {
      removeThisPopup()
    }, removeAfterMs)

    return () => {
      clearTimeout(timeout)
    }
  }, [removeAfterMs, removeThisPopup])

  let popupContent
  let type
  if ('txn' in content) {
    const {
      txn: { hash, success, summary },
    } = content
    type = success
    popupContent = <TransactionPopup hash={hash} success={success} summary={summary} removeAfterMs={removeAfterMs} />
  } else if ('listUpdate' in content) {
    const {
      listUpdate: { listUrl, oldList, newList, auto },
    } = content
    popupContent = <ListUpdatePopup popKey={popKey} listUrl={listUrl} oldList={oldList} newList={newList} auto={auto} />
  }

  // const faderStyle = useSpring({
  //   from: { width: '100%' },
  //   to: { width: '0%' },
  //   config: { duration: removeAfterMs ?? undefined },
  // })
  // CheckmarkCircleIcon
  return (
    <Popup type={type} data-id="popup-item">
      {/* <StyledClose color={theme.colors.textSubtle} onClick={removeThisPopup} /> */}
      <StyledClose onClick={removeThisPopup} data-id="popup-close-button">
        <CloseIcon />
      </StyledClose>
      {popupContent}
      {/* {removeAfterMs !== null ? <AnimatedFader style={faderStyle} /> : null} */}
    </Popup>
  )
}
