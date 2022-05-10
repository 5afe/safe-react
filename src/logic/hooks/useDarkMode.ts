import { useEffect } from 'react'
import useCachedState from 'src/utils/storage/useCachedState'

const useDarkMode = (): [boolean, (mode: boolean) => void] => {
  const [darkMode = false, setDarkMode] = useCachedState<boolean>('darkMode')

  const toggleDarkMode = (toggle: boolean): void => {
    document.documentElement.className = toggle ? 'darkMode' : ''
  }

  useEffect(() => {
    toggleDarkMode(darkMode)
  }, [darkMode])

  return [darkMode, setDarkMode]
}

export default useDarkMode
