import { useEffect, useState } from 'react'

const useMediaQuery = (query: string): boolean => {
  const [match, setMatch] = useState(window.matchMedia(query).matches)
  useEffect(() => {
    const handleResize = () => {
      const matched = window.matchMedia(query)
      setMatch(matched.matches)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [query])

  return match
}

export default useMediaQuery
