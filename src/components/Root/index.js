import { theme as styledTheme } from '@gnosis.pm/safe-react-components'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { ConnectedRouter } from 'connected-react-router'
import React from 'react'
import { hot } from 'react-hot-loader/root'
import { Provider } from 'react-redux'
import AppRoutes from 'routes'
import { history, store } from 'store'
import { ThemeProvider } from 'styled-components'
import theme from 'theme/mui'
import { wrapInSuspense } from 'utils/wrapInSuspense'

import Loader from '../Loader'
import PageFrame from '../layout/PageFrame'

import './index.module.scss'
import './OnboardCustom.module.scss'

const Root = () => (
  <ThemeProvider theme={styledTheme}>
    <Provider store={store}>
      <MuiThemeProvider theme={theme}>
        <ConnectedRouter history={history}>
          <PageFrame>{wrapInSuspense(<AppRoutes />, <Loader />)}</PageFrame>
        </ConnectedRouter>
      </MuiThemeProvider>
    </Provider>
  </ThemeProvider>
)

export default hot(Root)
