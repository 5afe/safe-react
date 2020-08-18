import { theme as styledTheme } from '@gnosis.pm/safe-react-components'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { ConnectedRouter } from 'connected-react-router'
import React from 'react'
import { Provider } from 'react-redux'
import { ThemeProvider } from 'styled-components'

import Loader from 'src/components/Loader'
import PageFrame from 'src/components/layout/PageFrame'

import AppRoutes from 'src/routes'
import { history, store } from 'src/store'
import theme from 'src/theme/mui'
import { wrapInSuspense } from 'src/utils/wrapInSuspense'

import './index.module.scss'
import './OnboardCustom.module.scss'

const Root = (): React.ReactElement => (
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

export default Root
