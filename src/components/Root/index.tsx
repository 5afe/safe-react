import * as Sentry from '@sentry/react'
import { theme as styledTheme, Loader } from '@gnosis.pm/safe-react-components'
import { useEffect, useState } from 'react'
import { setBaseUrl } from '@gnosis.pm/safe-react-gateway-sdk'

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
import LegacyRouteRedirection from './LegacyRouteRedirection'
import { logError, Errors, CodedException } from 'src/logic/exceptions/CodedException'
import { loadChains } from 'src/config/cache/chains'
import { setChainId } from 'src/logic/config/utils'
import { _getChainId } from 'src/config'
import { GATEWAY_URL } from 'src/utils/constants'

// Preloader is rendered outside of '#root' and acts as a loading spinner
// for the app and then chains loading
const removePreloader = () => {
  document.getElementById('safe-preloader-animation')?.remove()
}

const RootConsumer = (): React.ReactElement | null => {
  const [hasChains, setHasChains] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)

  useEffect(() => {
    // Initialize the SDK
    setBaseUrl(GATEWAY_URL)

    const initChains = async () => {
      try {
        await loadChains()
        setHasChains(true)
      } catch (err) {
        logError(Errors._904, err.message)
        setIsError(true)
      }
    }
    initChains()

    // Set store chainId and init contracts/session
    setChainId(_getChainId())
  }, [])

  // Chains failed to load
  if (isError) {
    removePreloader()
    throw new CodedException(Errors._904)
  }

  if (!hasChains) {
    return null
  }

  removePreloader()

  return (
    <App>
      {wrapInSuspense(
        <AppRoutes />,
        <LoadingContainer>
          <Loader size="md" />
        </LoadingContainer>,
      )}
    </App>
  )
}

// Chains loader requires error boundary, which requires Providers
// and Legacy redirection should be outside of Providers
const Root = (): React.ReactElement => (
  <>
    <LegacyRouteRedirection history={history} />
    <Providers store={store} history={history} styledTheme={styledTheme} muiTheme={theme}>
      <Sentry.ErrorBoundary fallback={GlobalErrorBoundary}>
        <RootConsumer />
      </Sentry.ErrorBoundary>
    </Providers>
  </>
)

export default Root
