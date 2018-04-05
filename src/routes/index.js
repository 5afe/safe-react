// @flow
import React from 'react'
import Loadable from 'react-loadable'
import { Switch, Redirect, Route } from 'react-router-dom'
import Loader from '~/components/Loader'
import Welcome from './welcome/container'

const Safe = Loadable({
  loader: () => import('./safe/container'),
  loading: Loader,
})

const SafeList = Loadable({
  loader: () => import('./safeList/container'),
  loading: Loader,
})

const Open = Loadable({
  loader: () => import('./open/container/Open'),
  loading: Loader,
})

export const SAFE_PARAM_ADDRESS = 'address'

const Routes = () => (
  <Switch>
    <Redirect exact from="/" to="/welcome" />
    <Route exact path="/welcome" component={Welcome} />
    <Route exact path="/open" component={Open} />
    <Route exact path="/safes" component={SafeList} />
    <Route exact path={`/safes/:${SAFE_PARAM_ADDRESS}`} component={Safe} />
  </Switch>
)

export default Routes

