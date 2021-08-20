import { Loader } from '@gnosis.pm/safe-react-components'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { generatePath, Redirect, Route, Switch, useLocation, useRouteMatch } from 'react-router-dom'

import {
  LOAD_ADDRESS,
  OPEN_ADDRESS,
  SAFELIST_ADDRESS,
  SAFE_PARAM_ADDRESS,
  SAFE_ROUTES,
  WELCOME_ADDRESS,
} from 'src/routes/routes'

import { LoadingContainer } from 'src/components/LoaderContainer'
import { useAnalytics } from 'src/utils/googleAnalytics'
import { lastViewedSafe } from 'src/logic/currentSession/store/selectors'

const Welcome = React.lazy(() => import('./welcome/container'))
const Open = React.lazy(() => import('./open/container/Open'))
const Safe = React.lazy(() => import('./safe/container'))
const Load = React.lazy(() => import('./load/container/Load'))

const SAFE_ADDRESS = `${SAFELIST_ADDRESS}/:${SAFE_PARAM_ADDRESS}`

const Routes = (): React.ReactElement => {
  const [isInitialLoad, setInitialLoad] = useState(true)
  const location = useLocation()
  const matchSafeWithAction = useRouteMatch<{ safeAddress: string; safeAction: string }>({
    path: `${SAFELIST_ADDRESS}/:safeAddress/:safeAction`,
  })

  const defaultSafe = useSelector(lastViewedSafe)
  const { trackPage } = useAnalytics()

  useEffect(() => {
    if (isInitialLoad && location.pathname !== '/') {
      setInitialLoad(false)
    }
  }, [location.pathname, isInitialLoad])

  useEffect(() => {
    if (matchSafeWithAction) {
      // prevent logging safeAddress
      let safePage = `${SAFELIST_ADDRESS}/SAFE_ADDRESS`
      if (matchSafeWithAction.params?.safeAction) {
        safePage += `/${matchSafeWithAction.params?.safeAction}`
      }
      trackPage(safePage)
    } else {
      const page = `${location.pathname}${location.search}`
      trackPage(page)
    }
  }, [location, matchSafeWithAction, trackPage])

  return (
    <Switch>
      <Route
        exact
        path="/"
        render={() => {
          if (!isInitialLoad) {
            return <Redirect to={WELCOME_ADDRESS} />
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
                to={generatePath(SAFE_ROUTES.ASSETS_BALANCES, {
                  safeAddress: defaultSafe,
                })}
              />
            )
          }

          return <Redirect to={WELCOME_ADDRESS} />
        }}
      />
      <Route component={Welcome} exact path={WELCOME_ADDRESS} />
      <Route component={Open} exact path={OPEN_ADDRESS} />
      <Route component={Safe} path={SAFE_ADDRESS} />
      <Route component={Load} path={`${LOAD_ADDRESS}/:safeAddress?`} />
      <Redirect to="/" />
    </Switch>
  )
}

export default Routes
