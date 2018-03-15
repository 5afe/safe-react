// @flow
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes'
import './App.scss'

const ReactRouterApp = () => (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
)

export default ReactRouterApp
