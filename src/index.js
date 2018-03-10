import 'babel-polyfill'
import { MuiThemeProvider } from 'material-ui/styles'
import React from 'react'
import ReactDOM from 'react-dom'
import theme from '~/theme/mui'
import App from './App'

const Root = () => (
  <MuiThemeProvider theme={theme}>
    <App />
  </MuiThemeProvider>
)

ReactDOM.render(
  <Root />,
  document.getElementById('root'),
)
