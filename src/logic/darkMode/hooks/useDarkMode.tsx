import { useEffect, useState } from 'react'
import { prefersDarkMode } from 'src/theme/variables'
import { loadFromStorage, saveToStorage } from 'src/utils/storage'

const DARK_MODE_KEY = 'SAFE__darkMode'
const CURRENT_DOCUMENT_EVENT = 'toggle-dark-mode'
const STORAGE_EVENTS = ['storage', CURRENT_DOCUMENT_EVENT]

const useDarkMode = (): { isDarkMode: boolean; toggleDarkMode: () => void } => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(prefersDarkMode)

  const getLocalDarkMode = async () => {
    try {
      const newValue = (await loadFromStorage<boolean>(DARK_MODE_KEY)) ?? prefersDarkMode
      setIsDarkMode(newValue)
    } catch {}
  }

  const toggleDarkMode = async () => {
    try {
      await saveToStorage<boolean>(DARK_MODE_KEY, !isDarkMode)
      setIsDarkMode(!isDarkMode)
      window.dispatchEvent(new Event(CURRENT_DOCUMENT_EVENT))
    } catch {}
  }

  useEffect(() => {
    getLocalDarkMode()

    STORAGE_EVENTS.forEach((ev) => window.addEventListener(ev, getLocalDarkMode))
    return () => {
      STORAGE_EVENTS.forEach((ev) => window.removeEventListener(ev, getLocalDarkMode))
    }
  }, [])

  return { isDarkMode, toggleDarkMode }
}

export default useDarkMode
