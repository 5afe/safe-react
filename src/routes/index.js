// @flow
import { CircularProgress } from 'material-ui/Progress'
import React from 'react'
import Loadable from 'react-loadable'
import { Switch, Redirect, Route } from 'react-router-dom'
import Welcome from './welcome/components/Layout'

const Loading = () => <CircularProgress size={50} />

const Transactions = Loadable({
  loader: () => import('./transactions/components/Layout'),
  loading: Loading,
})

const Routes = () => (
  <Switch>
    <Redirect exact from="/" to="/welcome" />
    <Route exact path="/welcome" component={Welcome} />
    <Route exact path="/transactions" component={Transactions} />
  </Switch>
)

export default Routes

