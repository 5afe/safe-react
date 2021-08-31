import { theme as styledTheme, Loader } from '@gnosis.pm/safe-react-components'
import React from 'react'
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

const Root = (): React.ReactElement => (
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

export default Root
