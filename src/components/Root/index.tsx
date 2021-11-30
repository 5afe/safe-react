import * as Sentry from '@sentry/react'
import { theme as styledTheme, Loader } from '@gnosis.pm/safe-react-components'
import styled from 'styled-components'
import { getChainsConfig } from '@gnosis.pm/safe-react-gateway-sdk'
import { useEffect, useState } from 'react'

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
import { addChains } from 'src/logic/config/store/reducer'
import { logError, Errors } from 'src/logic/exceptions/CodedException'
import { GATEWAY_URL } from 'src/utils/constants'

const Root = (): React.ReactElement => {
  const [hasChains, setHasChains] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)

  useEffect(() => {
    const loadChains = async () => {
      try {
        const { results = [] } = await getChainsConfig(GATEWAY_URL)
        addChains(results)
        setHasChains(true)
      } catch (err) {
        logError(Errors._904, err.message)
        setIsError(true)
      }
    }
    loadChains()
  }, [])

  // Chains failed to load
  if (isError) {
    throw new Error(Errors._904)
  }

  if (!hasChains) {
    // Relevant to /public
    return <PreloaderAnimation src="./resources/safe.png" />
  }

  return (
    <App>
      {wrapInSuspense(
        <AppRoutes />,
        <LoadingContainer>
          <Loader size="md" />
        </LoadingContainer>,
      )}
      <StoreMigrator />
    </App>
  )
}

// Chains loader requires error boundary, which requires Providers
// and Legacy redirection should be outside of Providers
const RootProviders = (): React.ReactElement => (
  <>
    <LegacyRouteRedirection history={history} />
    <Providers store={store} history={history} styledTheme={styledTheme} muiTheme={theme}>
      <Sentry.ErrorBoundary fallback={GlobalErrorBoundary}>
        <Root />
      </Sentry.ErrorBoundary>
    </Providers>
  </>
)

const PreloaderAnimation = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 120px;
  height: 120px;
  margin: -60px 0 0 -60px;
  animation: sk-bounce 2s infinite ease-in-out;
  animation-delay: -1s;

  @keyframes sk-bounce {
    0%,
    100% {
      transform: scale(0.8);
      -webkit-transform: scale(0.8);
    }
    50% {
      transform: scale(1);
      -webkit-transform: scale(1);
    }
  }
`

export default RootProviders
