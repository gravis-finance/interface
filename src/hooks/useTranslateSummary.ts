import React from 'react'
import { useTranslation } from 'react-i18next'

// pars template '{{key}}' to t(key)
const useTranslateSummary = () => {
  const { t } = useTranslation()
  return React.useCallback((summary) => summary.replace(/{{(.+?)}}/g, (_, key) => t(key)), [t])
}

export default useTranslateSummary
