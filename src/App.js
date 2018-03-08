import React from 'react'
import { BrowserRouter, Switch, Redirect, Route } from 'react-router-dom'
import Welcome from '~/routes/welcome/components/Layout'

const AppRoutes = () => (
  <Switch>
    <Redirect exact from="/" to="/welcome" />
    <Route exact path='/welcome' component ={Welcome} />
  </Switch>  
)

const ReactRouterApp = () => (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
)

export default ReactRouterApp
