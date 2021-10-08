import { theme as styledTheme, Loader } from '@gnosis.pm/safe-react-components'
import * as Sentry from '@sentry/react'

import { LoadingContainer } from 'src/components/LoaderContainer'
import App from 'src/components/App'
import GlobalErrorBoundary from 'src/components/GlobalErrorBoundary'
import AppRoutes from 'src/routes'
import { store } from 'src/store'
import { history } from 'src/routes/routes'
import theme from 'src/theme/mui'
import { wrapInSuspense } from 'src/utils/wrapInSuspense'
import Providers from '../Providers'
import './index.module.scss'
import './OnboardCustom.module.scss'
import './KeystoneCustom.module.scss'
import StoreMigrator from 'src/components/StoreMigrator'
import useDarkMode from 'src/logic/darkMode/hooks/useDarkMode'
import createTheme from '@material-ui/core/styles/createTheme'

const getColorByDiff = (baseHexColor: string, originalBaseHexColor: string, originalResultHexColor: string): string => {
  const removeHash = (hexColor: string) => hexColor.slice(1)

  const base = removeHash(baseHexColor)
  const from = removeHash(originalBaseHexColor)
  const to = removeHash(originalResultHexColor)

  return `#${parseInt(base, 16) + parseInt(from, 16) - parseInt(to, 16)}`
}

const Root = (): React.ReactElement => {
  const { isDarkMode } = useDarkMode()

  const darkColors = {
    background: '#1C1C1E',
    border: '#3A3A3C',
    connectedColor: '#029F7F',
    disabled: '#8D8D93',
    errorColor: '#FF453A',
    fancyColor: '#FF453A',
    fontColor: '#FFFFFF',
    primary: '#FFFFFF',
    secondary: '#029F7F',
    secondaryTextOrSvg: '#626269',
    secondaryBackground: '#2C2C2E',
    warningColor: theme.warningColor, // default
  }

  const darkStyledTheme: typeof styledTheme = {
    ...styledTheme,
    colors: {
      ...styledTheme.colors,
      primary: '#029F7F',
      get primaryLight() {
        const { primary, primaryLight } = styledTheme.colors
        return getColorByDiff(this.primary, primary, primaryLight)
      },
      get primaryHover() {
        const { primary, primaryHover } = styledTheme.colors
        return getColorByDiff(this.primary, primary, primaryHover)
      },

      secondary: '#FFFFFF',
      secondaryLight: '#626269',
      secondaryHover: '#8D8D93',

      error: '#FF453A', // default styledTheme.colors.error does not match what's shown in the  mobile dark mode palette
      get errorHover() {
        const { error, errorHover } = styledTheme.colors
        return getColorByDiff(this.error, error, errorHover)
      },
      errorTooltip: '#3B2C2C',

      text: '#FFFFFF',
      icon: '#626269',
      placeHolder: '#8D8D93',
      inputField: '#2C2C2E',

      separator: '#3A3A3C',
      rinkeby: styledTheme.colors.rinkeby, // default
      pendingTagHover: styledTheme.colors.pendingTagHover, // default
      tag: '#D4D5D3', // default
      background: '#121212',
      white: styledTheme.colors.white, // default
      warning: styledTheme.colors.warning, // default
      pending: styledTheme.colors.pending, // default

      overlay: {
        ...styledTheme.colors.overlay,
        color: '#3A3A3C',
      },
      shadow: {
        ...styledTheme.colors.shadow,
        color: styledTheme.colors.shadow.color, // default
      },
    },
  }

  const darkMuiTheme: typeof theme = {
    ...theme,
    palette: {
      ...theme.palette,
      ...(isDarkMode && {
        primary: {
          ...theme.palette.primary,
          main: darkColors.secondary,
        },
        secondary: {
          ...theme.palette.secondary,
          main: darkColors.primary,
        },
      }),
      type: isDarkMode ? 'dark' : 'light',
    },
    connected: darkColors.connectedColor,
    error: darkColors.errorColor,
    fancy: darkColors.fancyColor,
    secondaryText: darkColors.secondaryTextOrSvg,
    warning: darkColors.warningColor,
  }

  return (
    <Providers
      store={store}
      history={history}
      styledTheme={isDarkMode ? darkStyledTheme : styledTheme}
      muiTheme={createTheme(isDarkMode ? darkMuiTheme : theme)}
    >
      <Sentry.ErrorBoundary fallback={GlobalErrorBoundary}>
        <App>
          {wrapInSuspense(
            <AppRoutes />,
            <LoadingContainer>
              <Loader size="md" />
            </LoadingContainer>,
          )}
          <StoreMigrator />
        </App>
      </Sentry.ErrorBoundary>
    </Providers>
  )
}

export default Root
