// 
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Redirect, Route, Switch, withRouter } from 'react-router-dom'

import { LOAD_ADDRESS, OPEN_ADDRESS, SAFELIST_ADDRESS, SAFE_PARAM_ADDRESS, WELCOME_ADDRESS } from './routes'
import Welcome from './welcome/container'

import Loader from '~/components/Loader'
import { defaultSafeSelector } from '~/routes/safe/store/selectors'
import { withTracker } from '~/utils/googleAnalytics'

const Safe = React.lazy(() => import('./safe/container'))

const Open = React.lazy(() => import('./open/container/Open'))

const Load = React.lazy(() => import('./load/container/Load'))

const SAFE_ADDRESS = `${SAFELIST_ADDRESS}/:${SAFE_PARAM_ADDRESS}`


const Routes = ({ defaultSafe, location }) => {
  const [isInitialLoad, setInitialLoad] = useState(true)

  useEffect(() => {
    if (location.pathname !== '/') {
      setInitialLoad(false)
    }
  }, [])

  return (
    <Switch>
      <Route
        exact
        path="/"
        render={() => {
          if (!isInitialLoad) {
            return <Redirect to={WELCOME_ADDRESS} />
          }

          if (typeof defaultSafe === 'undefined') {
            return <Loader />
          }

          setInitialLoad(false)
          if (defaultSafe) {
            return <Redirect to={`${SAFELIST_ADDRESS}/${defaultSafe}/balances`} />
          }

          return <Redirect to={WELCOME_ADDRESS} />
        }}
      />
      <Route component={withTracker(Welcome)} exact path={WELCOME_ADDRESS} />
      <Route component={withTracker(Open)} exact path={OPEN_ADDRESS} />
      <Route component={withTracker(Safe)} path={SAFE_ADDRESS} />
      <Route component={withTracker(Load)} exact path={LOAD_ADDRESS} />
      <Redirect to="/" />
    </Switch>
  )
}

// $FlowFixMe
export default connect(
  (state) => ({ defaultSafe: defaultSafeSelector(state) }),
  null,
)(withRouter(Routes))
