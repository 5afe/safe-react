import red from 'material-ui/colors/red';
import { createMuiTheme } from 'material-ui/styles'

const palette = {
  primary: {
    main: '#1798cc',
  },
  secondary: {
    main: '#6b7c93',
  },
  error: red,
  contrastThreshold: 3,
  tonalOffset: 0.2,
}

// see https://material-ui-next.com/customization/themes/
// see https://github.com/mui-org/material-ui/blob/v1-beta/src/styles/createMuiTheme.js
export default createMuiTheme({
  typography: {
    fontFamily: 'Montserrat,sans-serif'
  }, 
  palette,
})
