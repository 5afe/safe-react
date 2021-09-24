import { theme } from '@gnosis.pm/safe-react-components'
import { prefersDarkMode } from '../../../theme/variables'

export declare type StyledTheme = typeof theme

const isThemeObject = (value: any): value is StyledTheme => {
  return typeof value === 'object' && !Array.isArray(value) && value !== null
}
const isHex = (value: any): value is string => {
  return typeof value === 'string' && value.startsWith('#')
}
const invertHexColor = (value: string): string => {
  return `#${(Number(`0x1${value.substr(1)}`) ^ 0xffffff).toString(16).substr(1)}`
}

export const getStyledTheme = (theme: StyledTheme, isDarkMode: boolean = prefersDarkMode) => {
  if (!isDarkMode) {
    return theme
  }

  const invertedTheme = Object.entries(theme).reduce((acc, [key, value]) => {
    return {
      ...acc,
      [key]: isThemeObject(value) ? getStyledTheme(value) : isHex(value) ? invertHexColor(value) : value,
    }
  }, {})

  return invertedTheme
}
