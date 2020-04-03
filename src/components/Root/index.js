// @flow
import 'babel-polyfill'

import { MuiThemeProvider } from '@material-ui/core/styles'
import { ConnectedRouter } from 'connected-react-router'
import React, { Suspense, useState } from 'react'
import { hot } from 'react-hot-loader/root'
import { Provider } from 'react-redux'

import Loader from '../Loader'
import PageFrame from '../layout/PageFrame'

const AppRoutes = React.lazy(() => import('~/routes'))
import LoadStore from '~/routes/safe/container/LoadStore'
import { history, store } from '~/store'
import theme from '~/theme/mui'

import './index.scss'
import './OnboardCustom.scss'

const Root = () => {
  const [safeLoaded, setSafeLoaded] = useState(false)
  return (
    <Provider store={store}>
      <MuiThemeProvider theme={theme}>
        <ConnectedRouter history={history}>
          <PageFrame>
            <LoadStore setSafeLoaded={setSafeLoaded} />
            <Suspense fallback={<Loader />}>
              <AppRoutes safeLoaded={safeLoaded} />
            </Suspense>
          </PageFrame>
        </ConnectedRouter>
      </MuiThemeProvider>
    </Provider>
  )
}

export default hot(Root)
