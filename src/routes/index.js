// @flow
import React from 'react'
import Loadable from 'react-loadable'
import { Switch, Redirect, Route } from 'react-router-dom'
import Loader from '~/components/Loader'
import Welcome from './welcome/container'
import { SAFELIST_ADDRESS, OPEN_ADDRESS, SAFE_PARAM_ADDRESS, WELCOME_ADDRESS } from './routes'

const Safe = Loadable({
  loader: () => import('./safe/container'),
  loading: Loader,
})

const Settings = Loadable({
  loader: () => import('./tokens/container'),
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

const SAFE_ADDRESS = `${SAFELIST_ADDRESS}/:${SAFE_PARAM_ADDRESS}`
const SAFE_SETTINGS = `${SAFE_ADDRESS}/settings`

export const settingsUrlFrom = (safeAddress: string) => `${SAFELIST_ADDRESS}/${safeAddress}/settings`

const Routes = () => (
  <Switch>
    <Redirect exact from="/" to={WELCOME_ADDRESS} />
    <Route exact path={WELCOME_ADDRESS} component={Welcome} />
    <Route exact path={OPEN_ADDRESS} component={Open} />
    <Route exact path={SAFELIST_ADDRESS} component={SafeList} />
    <Route exact path={SAFE_ADDRESS} component={Safe} />
    <Route exact path={SAFE_SETTINGS} component={Settings} />
  </Switch>
)

export default Routes

