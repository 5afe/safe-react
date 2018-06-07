// @flow
import 'babel-polyfill'

import { MuiThemeProvider } from 'material-ui/styles'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import PageFrame from '~/components/layout/PageFrame'
import { history, store } from '~/store'
import theme from '~/theme/mui'
import AppRoutes from '~/routes'
import fetchSafes from '~/routes/safe/store/actions/fetchSafes'

import './index.scss'

store.dispatch(fetchSafes())

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

ReactDOM.render(
  <Root />,
  document.getElementById('root'),
)
