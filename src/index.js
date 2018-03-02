import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { MuiThemeProvider } from 'material-ui/styles';
import theme from './theme/mui'

const Root = () => (
  <MuiThemeProvider theme={theme}>
    <App />
  </MuiThemeProvider>
)

ReactDOM.render(
  <Root />,
  document.getElementById('root')
);
