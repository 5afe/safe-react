import React, { ReactNode } from 'react'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { ConnectedRouter } from 'connected-react-router'
import { Provider } from 'react-redux'
import { ThemeProvider } from 'styled-components'
import { Store } from 'redux'
import { History } from 'history'

type ProvidersProps = {
  children: ReactNode
  store: Store
  history: History
  styledTheme: any
  muiTheme: any
}

function Providers({ children, store, styledTheme, muiTheme, history }: ProvidersProps): React.ReactElement {
  return (
    <ThemeProvider theme={styledTheme}>
      <Provider store={store}>
        <MuiThemeProvider theme={muiTheme}>
          <ConnectedRouter history={history}>{children}</ConnectedRouter>
        </MuiThemeProvider>
      </Provider>
    </ThemeProvider>
  )
}

export default Providers
