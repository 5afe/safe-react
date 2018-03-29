// @flow
import React from 'react'
import Loadable from 'react-loadable'
import { Switch, Redirect, Route } from 'react-router-dom'
import Loader from '~/components/Loader'
import Welcome from './welcome/container'

const SafeList = Loadable({
  loader: () => import('./safeList'),
  loading: Loader,
})

const Open = Loadable({
  loader: () => import('./open/container/Open'),
  loading: Loader,
})

const Routes = () => (
  <Switch>
    <Redirect exact from="/" to="/welcome" />
    <Route exact path="/welcome" component={Welcome} />
    <Route exact path="/open" component={Open} />
    <Route exact path="/safes" component={SafeList} />
  </Switch>
)

export default Routes

