import React from 'react'
import { Loader } from '@gnosis.pm/safe-react-components'
import { useSelector } from 'react-redux'
import { Redirect, Route, Switch, useLocation } from 'react-router-dom'

import { LoadingContainer } from 'src/components/LoaderContainer'
import { lastViewedSafe } from 'src/logic/currentSession/store/selectors'
import {
  generateSafeRoute,
  LOAD_SPECIFIC_SAFE_ROUTE,
  OPEN_SAFE_ROUTE,
  ADDRESSED_ROUTE,
  WELCOME_ROUTE,
  ROOT_ROUTE,
  LOAD_SAFE_ROUTE,
  getNetworkRootRoutes,
  extractSafeAddress,
  SAFE_ROUTES,
} from './routes'
import { getShortName } from 'src/config'
import { setChainId } from 'src/logic/config/utils'
import { setChainIdFromUrl } from 'src/utils/history'
import { usePageTracking } from 'src/utils/googleTagManager'

const Welcome = React.lazy(() => import('./welcome/Welcome'))
const CreateSafePage = React.lazy(() => import('./CreateSafePage/CreateSafePage'))
const LoadSafePage = React.lazy(() => import('./LoadSafePage/LoadSafePage'))
const SafeContainer = React.lazy(() => import('./safe/container'))

const Routes = (): React.ReactElement => {
  const location = useLocation()
  const { pathname } = location
  const lastSafe = useSelector(lastViewedSafe)

  // Google Tag Manager page tracking
  usePageTracking()

  return (
    <Switch>
      <Route
        // Remove all trailing slashes
        path="/:url*(/+)"
        render={() => <Redirect to={location.pathname.replace(/\/+$/, `${location.search}${location.hash}`)} />}
      />

      <Route
        // Redirect /xdai root to /gno
        path="/xdai"
        exact
        render={() => <Redirect to="/gno" />}
      />
      <Route
        // Redirect xdai: shortName to gno:
        path="/xdai\::url*"
        render={() => <Redirect to={location.pathname.replace(/\/xdai:/, `/gno:`)} />}
      />

      {
        // Redirection to open network specific welcome pages
        getNetworkRootRoutes().map(({ chainId, route, shortName }) => (
          <Route
            key={chainId}
            path={[route, `/${shortName}`]}
            render={() => {
              setChainId(chainId)
              return <Redirect to={ROOT_ROUTE} />
            }}
          />
        ))
      }

      <Route
        exact
        path={ROOT_ROUTE}
        render={() => {
          if (lastSafe === null) {
            return (
              <LoadingContainer>
                <Loader size="md" />
              </LoadingContainer>
            )
          }

          if (lastSafe) {
            const redirectPath = generateSafeRoute(SAFE_ROUTES.DASHBOARD, {
              shortName: getShortName(),
              safeAddress: lastSafe,
            })
            return <Redirect to={`${redirectPath}${location.search}`} />
          }

          return <Redirect to={WELCOME_ROUTE} />
        }}
      />

      <Route component={Welcome} exact path={WELCOME_ROUTE} />

      <Route component={CreateSafePage} exact path={OPEN_SAFE_ROUTE} />

      <Route
        path={ADDRESSED_ROUTE}
        render={() => {
          // Routes with a shortName prefix
          const validShortName = setChainIdFromUrl(pathname)
          // Safe address is used as a key to re-render the entire SafeContainer
          const safeAddress = extractSafeAddress()
          return validShortName ? <SafeContainer key={safeAddress} /> : <Redirect to={WELCOME_ROUTE} />
        }}
      />
      <Route component={LoadSafePage} path={[LOAD_SAFE_ROUTE, LOAD_SPECIFIC_SAFE_ROUTE]} />
      <Redirect to={ROOT_ROUTE} />
    </Switch>
  )
}

export default Routes
