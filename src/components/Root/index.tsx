import { theme as styledTheme, Loader } from '@gnosis.pm/safe-react-components'

import * as Sentry from '@sentry/react'

import { LoadingContainer } from 'src/components/LoaderContainer'
import App from 'src/components/App'
import GlobalErrorBoundary from 'src/components/GlobalErrorBoundary'
import AppRoutes from 'src/routes'
import { history, store } from 'src/store'
import theme from 'src/theme/mui'
import { wrapInSuspense } from 'src/utils/wrapInSuspense'
import Providers from '../Providers'

import './index.module.scss'
import './OnboardCustom.module.scss'
import './KeystoneCustom.module.scss'

type StyledThemeType = typeof styledTheme

const ourStyledTheme: StyledThemeType = {
  ...styledTheme,
  colors: {
    ...styledTheme.colors,
    primary: theme.palette.primary.main,
    primaryLight: theme.palette.secondary.light,
    primaryHover: theme.palette.secondary.dark,
    secondary: theme.palette.secondary.main,
    secondaryLight: theme.palette.secondary.light,
    secondaryHover: theme.palette.secondary.dark,
    error: theme.palette.error.main,
    background: theme.palette.background.default,
    warning: theme.palette.warning.main,
  },
}

const Root = (): React.ReactElement => (
  <Providers store={store} history={history} styledTheme={ourStyledTheme} muiTheme={theme}>
    <Sentry.ErrorBoundary fallback={GlobalErrorBoundary}>
      <App>
        {wrapInSuspense(
          <AppRoutes />,
          <LoadingContainer>
            <Loader size="md" />
          </LoadingContainer>,
        )}
      </App>
    </Sentry.ErrorBoundary>
  </Providers>
)

export default Root
