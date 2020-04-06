import { MuiThemeProvider } from '@material-ui/core/styles'
import { ConnectedRouter } from 'connected-react-router'
import React, { Suspense } from 'react'
import { hot } from 'react-hot-loader/root'
import { Provider } from 'react-redux'

import Loader from '../Loader'
import PageFrame from '../layout/PageFrame'

import AppRoutes from 'src/routes'
import { history, store } from 'src/store'
import theme from 'src/theme/mui'

import './index.scss'
import './OnboardCustom.scss'

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
