import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import XHR from 'i18next-xhr-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import { localStorageLanguageItem } from '@gravis.finance/uikit'

i18next
  .use(XHR)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: `/locales/{{lng}}.json`,
    },
    react: {
      useSuspense: true,
    },
    fallbackLng: 'en',
    preload: [ localStorage.getItem(localStorageLanguageItem) ? localStorage.getItem(localStorageLanguageItem)?.toLowerCase() as string  : 'en' ],
    // keySeparator: false,
    interpolation: { escapeValue: false },
    lng: localStorage.getItem(localStorageLanguageItem) ? localStorage.getItem(localStorageLanguageItem)?.toLowerCase() as string  : 'en',
  })

export default i18next
