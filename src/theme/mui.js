// @flow
import red from '@material-ui/core/colors/red'
import { createMuiTheme } from '@material-ui/core/styles'
import { primary, secondary, md, xl } from './variables'

export type WithStyles = {
  classes: Object,
}

const palette = {
  primary: {
    main: primary,
  },
  secondary: {
    main: secondary,
  },
  error: red,
  contrastThreshold: 3,
  tonalOffset: 0.2,
}

// see https://material-ui-next.com/customization/themes/
// see https://github.com/mui-org/material-ui/blob/v1-beta/src/styles/createMuiTheme.js
export default createMuiTheme({
  typography: {
    fontFamily: 'Montserrat,sans-serif',
  },
  overrides: {
    MuiButton: {
      containedPrimary: {
        backgroundColor: '#467ee5',
      },
      sizeLarge: {
        padding: `${md} ${xl}`,
        minHeight: '52px',
      },
    },
  },
  palette,
})
