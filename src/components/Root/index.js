// @flow
import 'babel-polyfill'

import { MuiThemeProvider } from '@material-ui/core/styles'
import React, { Suspense } from 'react'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import { hot } from 'react-hot-loader/root'
import PageFrame from '../layout/PageFrame'
import Loader from '../Loader'
import { history, store } from '~/store'
import theme from '~/theme/mui'
import AppRoutes from '~/routes'

import './index.scss'
import IntercomComponent from '~/utils/intercom'

const Root = () => (
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <ConnectedRouter history={history}>
        <PageFrame>
          <Suspense fallback={<Loader />}>
            <AppRoutes />
            <IntercomComponent />
          </Suspense>
        </PageFrame>
      </ConnectedRouter>
    </MuiThemeProvider>
  </Provider>
)

export default hot(Root)
