import React from 'react'
import { Link, LinkProps, useLocation } from 'react-router-dom'

const mergeSearchParams = (params1 = '', params2 = '') => {
  const urlParams1 = new URLSearchParams(params1)
  const urlParams2 = new URLSearchParams(params2)
  urlParams1.forEach((value, key) => {
    urlParams2.set(key, value)
  })
  return urlParams2.toString()
}

export function LinkWithParams<S>(props: LinkProps<S>) {
  const { to, title, className, target, children, onClick } = props
  const { search, pathname: locationPathname } =
    useLocation<{ from?: string }>()
  const isObject = typeof to !== 'string' && typeof to !== 'function'
  const pathname =
    typeof to === 'string' ? to : typeof to !== 'function' ? to?.pathname : ''
  const state = isObject ? to.state : undefined
  const [pathnameWithoutSearch, pathnameSearch] = pathname?.split('?') ?? []
  const from = locationPathname

  return (
    <Link
      title={title}
      className={className}
      target={target}
      to={{
        pathname: pathnameWithoutSearch,
        search: mergeSearchParams(pathnameSearch, search),
        state: { from, ...state }
      }}
      onClick={onClick}
    >
      {children}
    </Link>
  )
}
