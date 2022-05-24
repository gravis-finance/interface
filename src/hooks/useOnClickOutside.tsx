import { RefObject, useEffect, useRef } from 'react'

export function useOnClickOutside<T extends HTMLElement>(
  node: RefObject<T | undefined>,
  handler: undefined | ((e) => void)
) {
  const handlerRef = useRef<undefined | ((e) => void)>(handler)
  useEffect(() => {
    handlerRef.current = handler
  }, [handler])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (node.current?.contains(e.target as Node) ?? false) {
        return
      }
      if (handlerRef.current) handlerRef.current(e)
    }

    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [node])
}

export default useOnClickOutside
