import { theme as styledTheme } from '@gnosis.pm/safe-react-components'
import { darkColors } from './variables'

const getColorByDiff = (baseHexColor: string, originalBaseHexColor: string, originalResultHexColor: string): string => {
  const removeHash = (hexColor: string) => hexColor.slice(1)

  const base = removeHash(baseHexColor)
  const from = removeHash(originalBaseHexColor)
  const to = removeHash(originalResultHexColor)

  return `#${parseInt(base, 16) + parseInt(from, 16) - parseInt(to, 16)}`
}

const darkStyledTheme: typeof styledTheme = {
  ...styledTheme,
  colors: {
    ...styledTheme.colors,
    primary: darkColors.secondary,
    get primaryLight() {
      const { primary, primaryLight } = styledTheme.colors
      return getColorByDiff(this.primary, primary, primaryLight)
    },
    get primaryHover() {
      const { primary, primaryHover } = styledTheme.colors
      return getColorByDiff(this.primary, primary, primaryHover)
    },

    secondary: darkColors.secondary,
    secondaryLight: darkColors.secondaryTextOrSvg,
    secondaryHover: darkColors.disabled,

    error: darkColors.errorColor, // default styledTheme.colors.error does not match what's shown in the  mobile dark mode palette
    get errorHover() {
      const { error, errorHover } = styledTheme.colors
      return getColorByDiff(this.error, error, errorHover)
    },
    errorTooltip: '#3B2C2C',

    text: darkColors.secondary,
    icon: darkColors.secondaryTextOrSvg,
    placeHolder: darkColors.disabled,
    inputField: darkColors.secondaryBackground,

    separator: darkColors.border,
    rinkeby: styledTheme.colors.rinkeby, // default
    pendingTagHover: styledTheme.colors.pendingTagHover, // default
    tag: styledTheme.colors.tag, // default
    background: '#121212',
    white: styledTheme.colors.white, // default
    warning: styledTheme.colors.warning, // default
    pending: styledTheme.colors.pending, // default

    overlay: {
      ...styledTheme.colors.overlay,
      color: darkColors.border,
    },
    shadow: {
      ...styledTheme.colors.shadow,
      color: styledTheme.colors.shadow.color, // default
    },
  },
}

export default darkStyledTheme
