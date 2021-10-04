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
import { getNetworkId, getNetworks } from 'src/config'
import { PUBLIC_URL } from 'src/utils/constants'
import StoreMigrator from 'src/components/StoreMigrator'
import { getShortChainNameById } from 'src/routes/utils/prefixedSafeAddress'

const Root = (): React.ReactElement => {
  const { pathname, hash, search } = window.location

  const isLegacyRoute = pathname === `${PUBLIC_URL}/` && hash.startsWith('#/')
  if (isLegacyRoute) {
    const networkLabel = window.location.hostname.split('.')[0]
    const id = getNetworks().find(({ label }) => label === networkLabel)?.id || getNetworkId()
    const pathname = hash.replace('#/safes/', getShortChainNameById(id))
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
          <StoreMigrator />
        </App>
      </Sentry.ErrorBoundary>
    </Providers>
  )
}

export default Root
