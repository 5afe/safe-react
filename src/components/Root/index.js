// @flow
import 'babel-polyfill'

import { theme as styledTheme } from '@gnosis.pm/ui-components'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { ConnectedRouter } from 'connected-react-router'
import React, { Suspense } from 'react'
import { hot } from 'react-hot-loader/root'
import { Provider } from 'react-redux'
import { ThemeProvider } from 'styled-components'

import Loader from '../Loader'
import PageFrame from '../layout/PageFrame'

import AppRoutes from '~/routes'
import { history, store } from '~/store'
import theme from '~/theme/mui'

import './index.scss'
import './OnboardCustom.scss'

const Root = () => (
  <ThemeProvider theme={styledTheme}>
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
  </ThemeProvider>
)

export default hot(Root)
