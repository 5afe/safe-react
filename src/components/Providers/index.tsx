import { ReactNode } from 'react'
import { MuiThemeProvider, Theme as MuiTheme } from '@material-ui/core/styles'
import { Router } from 'react-router'
import { Provider } from 'react-redux'
import { ThemeProvider } from 'styled-components'
import { Store } from 'redux'
import { History } from 'history'
import { StyledTheme } from 'src/logic/darkMode/utils/getStyledTheme'
import { getMuiTheme, getStyledTheme } from 'src/logic/darkMode/utils'
import useDarkMode from 'src/logic/darkMode/hooks/useDarkMode'

type ProvidersProps = {
  children: ReactNode
  store: Store
  history: History
  styledTheme: StyledTheme
  muiTheme: MuiTheme
}

function Providers({ children, store, styledTheme, muiTheme, history }: ProvidersProps): React.ReactElement {
  const { isDarkMode } = useDarkMode()
  return (
    <ThemeProvider theme={getStyledTheme(styledTheme, isDarkMode)}>
      <Provider store={store}>
        <MuiThemeProvider theme={getMuiTheme(muiTheme, isDarkMode)}>
          <Router history={history}>{children}</Router>
        </MuiThemeProvider>
      </Provider>
    </ThemeProvider>
  )
}

export default Providers
