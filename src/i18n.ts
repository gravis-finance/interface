import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import XHR from 'i18next-xhr-backend'
import { getLanguageSearchParam } from '@gravis.finance/uikit'

i18next
  .use(XHR)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: `/locales/{{lng}}.json`,
    },
    react: {
      useSuspense: true,
    },
    fallbackLng: 'en',
    preload: [getLanguageSearchParam() as string],
    // keySeparator: false,
    interpolation: { escapeValue: false },
    lng: getLanguageSearchParam(),
  })

export default i18next
