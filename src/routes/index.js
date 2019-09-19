// @flow
import React from 'react'
import { connect } from 'react-redux'
import { Switch, Redirect, Route } from 'react-router-dom'
import { defaultSafeSelector } from '~/routes/safeList/store/selectors'
import Welcome from './welcome/container'
import {
  SAFELIST_ADDRESS,
  OPEN_ADDRESS,
  SAFE_PARAM_ADDRESS,
  WELCOME_ADDRESS,
  OPENING_ADDRESS,
  LOAD_ADDRESS,
} from './routes'

const Safe = React.lazy(() => import('./safe/container'))

const SafeList = React.lazy(() => import('./safeList/container'))

const Open = React.lazy(() => import('./open/container/Open'))

const Opening = React.lazy(() => import('./opening/container'))

const Load = React.lazy(() => import('./load/container/Load'))

const SAFE_ADDRESS = `${SAFELIST_ADDRESS}/:${SAFE_PARAM_ADDRESS}`

type RoutesProps = {
  defaultSafe?: string,
}

const Routes = ({ defaultSafe }: RoutesProps) => (
  <Switch>
    <Route
      exact
      path="/"
      render={() => {
        if (typeof defaultSafe === 'undefined') {
          return 'Loading...'
        }
        if (defaultSafe) {
          return <Redirect to={`${SAFELIST_ADDRESS}/${defaultSafe}`} />
        }
        return <Redirect to={WELCOME_ADDRESS} />
      }}
    />
    <Route exact path={WELCOME_ADDRESS} component={Welcome} />
    <Route exact path={OPEN_ADDRESS} component={Open} />
    <Route exact path={SAFELIST_ADDRESS} component={SafeList} />
    <Route exact path={SAFE_ADDRESS} component={Safe} />
    <Route exact path={OPENING_ADDRESS} component={Opening} />
    <Route exact path={LOAD_ADDRESS} component={Load} />
  </Switch>
)

export default connect<Object, Object, ?Function, ?Object>(
  // $FlowFixMe
  (state) => ({ defaultSafe: defaultSafeSelector(state) }),
  null,
)(Routes)
