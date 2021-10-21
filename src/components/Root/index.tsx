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

const Root = (): React.ReactElement => {
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
