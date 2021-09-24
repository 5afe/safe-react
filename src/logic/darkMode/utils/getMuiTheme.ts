import createTheme, { Theme, ThemeOptions } from '@material-ui/core/styles/createTheme'
import { prefersDarkMode, secondary, primary } from '../../../theme/variables'

export const getMuiTheme = (theme: Theme, isDarkMode = prefersDarkMode): Theme => {
  if (!isDarkMode) {
    return createTheme(theme)
  }

  const { palette, ...rest } = theme
  const darkTheme: ThemeOptions = {
    palette: {
      ...palette,
      primary: {
        main: secondary,
      },
      secondary: {
        main: primary,
      },
      type: isDarkMode ? 'dark' : 'light',
    },
    ...rest,
  }

  return createTheme(darkTheme)
}
