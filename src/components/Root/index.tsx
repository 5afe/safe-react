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
import LegacyRouteRedirection from './LegacyRouteRedirection'
import { useEffect, useState } from 'react'
import { getChainsConfig } from '@gnosis.pm/safe-react-gateway-sdk'
import { addChains } from 'src/logic/config/store/reducer'
import { GATEWAY_URL } from 'src/utils/constants'

const Root = (): React.ReactElement => {
  const [hasChains, setHasChains] = useState<boolean>(false)

  useEffect(() => {
    const loadChains = async () => {
      try {
        const { results = [] } = await getChainsConfig(GATEWAY_URL)
        addChains(results)
      } catch (err) {
        console.error('Error while getting network configuration:', err)
        // TODO: throw
      } finally {
        setHasChains(true)
      }
    }
    loadChains()
  }, [])

  if (!hasChains) {
    return <>Loading...</>
  }

  return (
    <>
      <LegacyRouteRedirection history={history} />
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
    </>
  )
}

export default Root
