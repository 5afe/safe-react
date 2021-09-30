import { theme as styledTheme, Loader } from '@gnosis.pm/safe-react-components'
import { Redirect, Router } from 'react-router'
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
import { getNetworkName } from 'src/config'
import { PUBLIC_URL } from 'src/utils/constants'

const Root = (): React.ReactElement => {
  const { pathname, hash, search } = window.location

  const isLegacyRoute = pathname === `${PUBLIC_URL}/` && hash.startsWith('#/')
  if (isLegacyRoute) {
    const pathname = hash.replace('#', getNetworkName().toLowerCase())
    return (
      <Router history={history}>
        <Redirect to={pathname + search} />
      </Router>
    )
  }

  return (
    <Providers store={store} history={history} styledTheme={styledTheme} muiTheme={theme}>
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
}

export default Root
