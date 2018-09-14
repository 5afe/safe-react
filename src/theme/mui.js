// @flow
import red from '@material-ui/core/colors/red'
import { createMuiTheme } from '@material-ui/core/styles'
import { largeFontSize, mediumFontSize, smallFontSize, primary, secondary, md, lg, background } from './variables'

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
      root: {
        fontFamily: 'Roboto Mono, monospace',
        letterSpacing: '1px',
      },
      containedPrimary: {
        backgroundColor: secondary,
      },
      sizeLarge: {
        padding: `${md} ${lg}`,
        minHeight: '52px',
        fontSize: mediumFontSize,
      },
    },
    MuiStepIcon: {
      active: {
        color: `${secondary} !important`,
      },
    },
    MuiTypography: {
      body1: {
        fontFamily: 'Roboto Mono, monospace',
        letterSpacing: '-0.5px',
      },
    },
    MuiFormHelperText: {
      root: {
        fontFamily: 'Roboto Mono, monospace',
        fontSize: smallFontSize,
        padding: `0 0 0 ${md}`,
        position: 'relative',
        top: '20px',
        color: secondary,
        order: 0,
        marginTop: '0px',
        backgroundColor: background,
      },
    },
    MuiInput: {
      root: {
        fontFamily: 'Roboto Mono, monospace',
        color: primary,
        fontSize: largeFontSize,
        lineHeight: '56px',
        order: 1,
        padding: `0 ${md}`,
        backgroundColor: background,
      },
      input: {
        padding: 0,
      },
      underline: {
        '&:before': {
          borderBottom: `2px solid ${secondary}`,
        },
        '&:focus:before': {
          borderBottom: '1px solid purple',
        },
        '&:hover:not($disabled):not($focused):not($error):before': {
          borderBottom: `2px solid ${secondary}`,
        },
      },
    },
  },
  palette,
})
