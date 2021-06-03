import React, { lazy } from 'react'
import styled, { css } from 'styled-components'
import { useTransition } from 'react-spring'
import { isMobile } from 'react-device-detect'
import { transparentize } from 'polished'

const DialogOverlay = lazy(async () => {
  const [{ DialogOverlay: ImportedDialogOverlay }, { animated }] = await Promise.all([
    import('@reach/dialog'),
    import('react-spring'),
    import('@reach/dialog/styles.css' as any),
  ])
  const AnimatedDialogOverlay = animated(ImportedDialogOverlay)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const StyledDialogOverlay = styled(AnimatedDialogOverlay)`
    &[data-reach-dialog-overlay] {
      z-index: 21;
      background-color: transparent;
      overflow: hidden;

      display: flex;
      align-items: center;
      justify-content: center;

      background-color: rgba(106, 106, 108, 0.8);
    }
  `
  return { default: StyledDialogOverlay }
})

const DialogContent = lazy(async () => {
  const [{ DialogContent: ImportedDialogContent }, { animated }] = await Promise.all([
    import('@reach/dialog'),
    import('react-spring'),
  ])
  const AnimatedDialogContent = animated(ImportedDialogContent)
  // destructure to not pass custom props to Dialog DOM element
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const StyledDialogContent = styled(({ minHeight, maxHeight, mobile, isOpen, ...rest }) => (
    <AnimatedDialogContent {...rest} />
  )).attrs({
    'aria-label': 'dialog',
  })`
    &[data-reach-dialog-content] {
      margin: 0 0 2rem 0;
      // border: 1px solid ${({ theme }) => theme.colors.invertedContrast};
      background-color: ${({ istransparent, theme }) =>
        istransparent ? 'transparent' : theme.colors.invertedContrast};
      // box-shadow: 0 4px 8px 0 ${transparentize(0.95, '#191326')};
      padding: 0px;
      width: 80%;

      @media screen and (max-width: 525px) {
        width: 100%;
      }

      overflow: hidden;

      align-self: center;

      max-width: 450px;
      > * {
        background: #1c1c1c;
      }
      ${({ maxHeight }) =>
        maxHeight &&
        css`
          max-height: 100vh;
        `}
      ${({ minHeight }) =>
        minHeight &&
        css`
          min-height: ${minHeight}vh;
        `}
      display: flex;
      border-radius: 6px;

      // ${({ theme }) => theme.mediaQueries.lg} {
      //   width: 65vw;
      // }
      // ${({ theme }) => theme.mediaQueries.sm} {
      //   width: 85vw;
      // }
    }
  `
  return { default: StyledDialogContent }
})

interface ModalProps {
  isOpen: boolean
  onDismiss: () => void
  minHeight?: number | false
  maxHeight?: number
  initialFocusRef?: React.RefObject<any>
  children?: React.ReactNode
  istransparent?: boolean
}

export default function Modal({
  isOpen,
  onDismiss,
  minHeight = false,
  maxHeight = 70,
  initialFocusRef,
  children,
  istransparent,
}: ModalProps) {
  // TODO
  const fadeTransition = useTransition(isOpen, null, {
    config: { duration: 200 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  })

  return (
    <>
      {fadeTransition.map(
        ({ item, key, props }) =>
          item && (
            <DialogOverlay key={key} style={props} onDismiss={onDismiss} initialFocusRef={initialFocusRef}>
              <DialogContent
                aria-label="dialog content"
                minHeight={minHeight}
                maxHeight={maxHeight}
                mobile={isMobile}
                istransparent={istransparent}
              >
                {/* prevents the automatic focusing of inputs on mobile by the reach dialog */}
                {/* eslint-disable */}
                {!initialFocusRef && isMobile ? <div tabIndex={1} /> : null}
                {/* eslint-enable */}
                {children}
              </DialogContent>
            </DialogOverlay>
          )
      )}
    </>
  )
}
