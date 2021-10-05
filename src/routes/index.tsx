import React from 'react'
import { Loader } from '@gnosis.pm/safe-react-components'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Redirect, Route, Switch, useLocation } from 'react-router-dom'

import { LoadingContainer } from 'src/components/LoaderContainer'
import { useAnalytics } from 'src/utils/googleAnalytics'
import { lastViewedSafe } from 'src/logic/currentSession/store/selectors'
import {
  generateSafeRoute,
  getPrefixedSafeAddressSlug,
  LOAD_ROUTE,
  OPEN_ROUTE,
  SAFE_ADDRESS_SLUG,
  SAFE_ROUTE,
  SAFE_ROUTES,
  WELCOME_ROUTE,
} from './routes'

const Welcome = React.lazy(() => import('./welcome/Welcome'))
const CreateSafePage = React.lazy(() => import('./CreateSafePage/CreateSafePage'))
const LoadSafePage = React.lazy(() => import('./LoadSafePage/LoadSafePage'))
const Safe = React.lazy(() => import('./safe/container'))

const Routes = (): React.ReactElement => {
  const [isInitialLoad, setInitialLoad] = useState(true)
  const location = useLocation()
  const defaultSafe = useSelector(lastViewedSafe)
  const { trackPage } = useAnalytics()

  useEffect(() => {
    if (isInitialLoad && location.pathname === '/') {
      setInitialLoad(false)
    }
  }, [location.pathname, isInitialLoad])

  useEffect(() => {
    // Anonymize safe address when tracking page views
    const pathname = location.pathname.replace(getPrefixedSafeAddressSlug(), 'SAFE_ADDRESS')
    trackPage(pathname + location.search)
  }, [location, trackPage])

  return (
    <Switch>
      <Route
        exact
        path="/"
        render={() => {
          if (!isInitialLoad) {
            return <Redirect to={WELCOME_ROUTE} />
          }

          if (defaultSafe === null) {
            return (
              <LoadingContainer>
                <Loader size="md" />
              </LoadingContainer>
            )
          }

          if (defaultSafe) {
            return (
              <Redirect
                to={generateSafeRoute(SAFE_ROUTES.ASSETS_BALANCES, {
                  [SAFE_ADDRESS_SLUG]: defaultSafe,
                })}
              />
            )
          }

          return <Redirect to={WELCOME_ROUTE} />
        }}
      />
      <Route component={Welcome} exact path={WELCOME_ROUTE} />
      <Route component={CreateSafePage} exact path={OPEN_ROUTE} />
      <Route component={LoadSafePage} path={LOAD_ROUTE} />
      <Route component={Safe} path={SAFE_ROUTE} />
      <Redirect to="/" />
    </Switch>
  )
}

export default Routes
