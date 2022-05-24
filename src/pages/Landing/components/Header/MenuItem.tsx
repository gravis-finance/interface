import { ButtonBase } from '@gravis.finance/uikit'
import React from 'react'

const MenuItem = ({
  onClick,
  href,
  onActive,
  ...props
}: React.ComponentProps<typeof ButtonBase> &
  React.HTMLAttributes<HTMLAnchorElement>) => {
  const clickHandler = (event: any) => {
    event.preventDefault()

    const view = document.querySelector(href)
    const position = view.getBoundingClientRect()
    setTimeout(() => {
      window.scrollTo({
        left: position.left,
        top: position.top + window.scrollY - 70,
        behavior: 'smooth'
      })
    }, 50)

    if (onClick) onClick(event)
  }

  React.useEffect(() => {
    const view = href !== '#' ? document.querySelector(href) : null
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (onActive) onActive(href)
        }
      },
      {
        root: null,
        rootMargin: '100px',
        threshold: 0.3
      }
    )
    if (view) {
      intersectionObserver.observe(view)
    }
    return () => {
      intersectionObserver?.disconnect()
    }
  }, [href, onActive])

  return <ButtonBase href={href} onClick={clickHandler} {...props} />
}

export default MenuItem
