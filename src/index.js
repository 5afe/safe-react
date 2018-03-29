// @flow
import 'babel-polyfill'

import { MuiThemeProvider } from 'material-ui/styles'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import { history, store } from '~/store'
import theme from '~/theme/mui'
import AppRoutes from '~/routes'
import './index.scss'

const Root = () => (
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <ConnectedRouter history={history}>
        <AppRoutes />
      </ConnectedRouter>
    </MuiThemeProvider>
  </Provider>
)

ReactDOM.render(
  <Root />,
  document.getElementById('root'),
)
