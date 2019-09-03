// @flow
import 'core-js/stable'
import 'regenerator-runtime/runtime'

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

const Root = () => (
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <ConnectedRouter history={history}>
        <PageFrame>
          <Suspense fallback={<Loader />}>
            <AppRoutes />
          </Suspense>
        </PageFrame>
      </ConnectedRouter>
    </MuiThemeProvider>
  </Provider>
)

export default hot(Root)
