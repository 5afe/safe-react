// @flow
/* eslint-disable */
import 'babel-polyfill'
require('dotenv').config()

import { MuiThemeProvider } from '@material-ui/core/styles'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import PageFrame from '~/components/layout/PageFrame'
import { history, store } from '~/store'
import theme from '~/theme/mui'
import AppRoutes from '~/routes'

import './index.scss'

const Root = () => (
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <ConnectedRouter history={history}>
        <PageFrame>
          <AppRoutes />
        </PageFrame>
      </ConnectedRouter>
    </MuiThemeProvider>
  </Provider>
)

ReactDOM.render(<Root />, document.getElementById('root'))
