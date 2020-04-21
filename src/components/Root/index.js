// @flow
import 'babel-polyfill'

import { MuiThemeProvider } from '@material-ui/core/styles'
import { ConnectedRouter } from 'connected-react-router'
import React from 'react'
import { hot } from 'react-hot-loader/root'
import { Provider } from 'react-redux'

import Loader from '../Loader'
import PageFrame from '../layout/PageFrame'

import AppRoutes from '~/routes'
import { history, store } from '~/store'
import theme from '~/theme/mui'
import { wrapInSuspense } from '~/utils/wrapInSuspense'

import './index.scss'
import './OnboardCustom.scss'

const Root = () => {
  return (
    <Provider store={store}>
      <MuiThemeProvider theme={theme}>
        <ConnectedRouter history={history}>
          <PageFrame>{wrapInSuspense(<AppRoutes />, <Loader />)}</PageFrame>
        </ConnectedRouter>
      </MuiThemeProvider>
    </Provider>
  )
}

export default hot(Root)
