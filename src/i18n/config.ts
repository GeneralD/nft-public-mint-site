import i18next from 'i18next'
import I18nextBrowserLanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import en from './en.yml'
import ja from './ja.yml'

i18next
    .use(initReactI18next)
    .use(I18nextBrowserLanguageDetector)
    .init({
        resources: {
            en: {
                translation: en,
            },
            ja: {
                translation: ja,
            },
        },
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
        detection: {
            convertDetectedLanguage: (lang: string) => lang.split('-')[0],
        }
    })