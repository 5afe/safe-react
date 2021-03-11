import React, { Suspense, lazy, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Redirect, Route, Switch, useLocation, useRouteMatch } from 'react-router-dom'

import { LOAD_ADDRESS, OPEN_ADDRESS, SAFELIST_ADDRESS, SAFE_PARAM_ADDRESS, WELCOME_ADDRESS } from './routes'

import Loader from 'src/components/Loader'
import { defaultSafeSelector } from 'src/logic/safe/store/selectors'
import { useAnalytics } from 'src/utils/googleAnalytics'
import { DEFAULT_SAFE_INITIAL_STATE } from 'src/logic/safe/store/reducer/safe'

const Welcome = lazy(() => import('./welcome/container'))

const Open = lazy(() => import('./open/container/Open'))

const Safe = lazy(() => import('./safe/container'))

const Load = lazy(() => import('./load/container/Load'))

const SAFE_ADDRESS = `${SAFELIST_ADDRESS}/:${SAFE_PARAM_ADDRESS}`

const Routes = (): React.ReactElement => {
  const [isInitialLoad, setInitialLoad] = useState(true)
  const location = useLocation()
  const matchSafeWithAction = useRouteMatch<{ safeAddress: string; safeAction: string }>({
    path: `${SAFELIST_ADDRESS}/:safeAddress/:safeAction`,
  })

  const defaultSafe = useSelector(defaultSafeSelector)
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
    <Suspense fallback={null}>
      <Switch>
        <Route
          exact
          path="/"
          component={() => {
            if (!isInitialLoad) {
              return <Redirect to={WELCOME_ADDRESS} />
            }

            if (defaultSafe === DEFAULT_SAFE_INITIAL_STATE) {
              return <Loader />
            }

            if (defaultSafe) {
              return <Redirect to={`${SAFELIST_ADDRESS}/${defaultSafe}/balances`} />
            }

            return <Redirect to={WELCOME_ADDRESS} />
          }}
        />
        <Route component={Welcome} exact path={WELCOME_ADDRESS} />
        <Route component={Open} exact path={OPEN_ADDRESS} />
        <Route component={Safe} path={SAFE_ADDRESS} />
        <Route component={Load} exact path={LOAD_ADDRESS} />
        <Redirect to="/" />
      </Switch>
    </Suspense>
  )
}

export default Routes
