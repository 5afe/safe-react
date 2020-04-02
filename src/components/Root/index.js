// @flow
import 'babel-polyfill'

import { MuiThemeProvider } from '@material-ui/core/styles'
import { ConnectedRouter } from 'connected-react-router'
import React, { Suspense, useState } from 'react'
import { hot } from 'react-hot-loader/root'
import { Provider } from 'react-redux'

import Loader from '../Loader'
import PageFrame from '../layout/PageFrame'

import AppRoutes from '~/routes'
import LoadStore from '~/routes/safe/container/LoadStore'
import { history, store } from '~/store'
import theme from '~/theme/mui'

import './index.scss'
import './OnboardCustom.scss'

const Root = () => {
  const [isSafeLoaded, setSafeLoaded] = useState(false)
  const updateSafeLoadedState = (isSafeLoaded: boolean) => setSafeLoaded(isSafeLoaded)
  return (
    <Provider store={store}>
      <MuiThemeProvider theme={theme}>
        <ConnectedRouter history={history}>
          <PageFrame>
            <Suspense fallback={<Loader />}>
              {isSafeLoaded ? <AppRoutes /> : null}
              <LoadStore setSafeLoaded={updateSafeLoadedState} />
            </Suspense>
          </PageFrame>
        </ConnectedRouter>
      </MuiThemeProvider>
    </Provider>
  )
}

export default hot(Root)
