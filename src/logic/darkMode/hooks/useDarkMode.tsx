import { useEffect, useState } from 'react'
import { prefersDarkMode } from 'src/theme/variables'

const DARK_MODE_KEY = 'SAFE__darkMode'

const setLocalDarkMode = (value: boolean): void => {
  localStorage.setItem(DARK_MODE_KEY, JSON.stringify(value))
}

const getLocalDarkMode = (): boolean => {
  try {
    const value = localStorage.getItem(DARK_MODE_KEY)
    return value ? JSON.parse(value) : prefersDarkMode
  } catch {
    return prefersDarkMode
  }
}

const useDarkMode = (): { isDarkMode: boolean; toggleDarkMode: () => void } => {
  const [isDarkMode, setDarkMode] = useState<boolean>(() => getLocalDarkMode())
  const toggleDarkMode = () => {
    const newValue = !isDarkMode
    setDarkMode(newValue)
    setLocalDarkMode(newValue)
  }

  // Update state if localStorage changes, i.e. in another tab
  useEffect(() => {
    const onStorageUpdate = ({ key, newValue, oldValue }: StorageEvent): void => {
      if (key === DARK_MODE_KEY && newValue !== oldValue) {
        setDarkMode(newValue ? JSON.parse(newValue) : getLocalDarkMode())
      }
    }

    window.addEventListener('storage', onStorageUpdate)
    return () => {
      window.removeEventListener('storage', onStorageUpdate)
    }
  }, [])

  return { isDarkMode, toggleDarkMode }
}

export default useDarkMode
