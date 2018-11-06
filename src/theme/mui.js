// @flow
import red from '@material-ui/core/colors/red'
import { createMuiTheme } from '@material-ui/core/styles'
import { largeFontSize, mediumFontSize, smallFontSize, disabled, primary, secondary, md, lg, background, bolderFont, boldFont, buttonLargeFontSize } from './variables'

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
        letterSpacing: '0.9px',
        '&:disabled': {
          color: disabled,
        },
        color: disabled,
      },
      disabled: {
        cursor: 'pointer',
      },
      contained: {
        boxShadow: 'none',
      },
      containedPrimary: {
        backgroundColor: secondary,
      },
      sizeLarge: {
        padding: `${md} ${lg}`,
        minHeight: '52px',
        fontSize: buttonLargeFontSize,
        fontWeight: boldFont,
      },
      sizeSmall: {
        minWidth: '130px',
        fontSize: smallFontSize,
      },
    },
    MuiStepIcon: {
      root: {
        fontSize: '22px',
      },
      completed: {
        color: `${secondary} !important`,
      },
      active: {
        color: `${secondary} !important`,
      },
    },
    MuiTypography: {
      body1: {
        fontFamily: 'Roboto Mono, monospace',
        letterSpacing: '-0.5px',
        fontSize: mediumFontSize,
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
        '&:$disabled': {
          color: '#0000ff',
        },
      },
      input: {
        padding: 0,
        color: 'initial',
        textOverflow: 'ellipsis',
        display: 'flex',
      },
      underline: {
        '&:before': {
          borderBottom: `2px solid ${secondary}`,
        },
        '&:hover:not($disabled):not($focused):not($error):before': {
          borderBottom: `2px solid ${secondary}`,
        },
      },
      formControl: {
        marginTop: '0px !important',
      },
    },
    MuiStepLabel: {
      label: {
        textAlign: 'left',
      },
    },
    MuiSnackbarContent: {
      root: {
        boxShadow: '0 0 10px 0 rgba(33, 48, 77, 0.1)',
        borderRadius: '3px',
        color: primary,
      },
    },
    MuiTab: {
      root: {
        fontFamily: 'Roboto Mono, monospace',
        fontWeight: 'normal',
      },
      selected: {
        fontWeight: bolderFont,
      },
    },
    MuiTablePagination: {
      toolbar: {
        '& > span:nth-child(2)': {
          order: 1,
        },
      },
      selectIcon: {
        height: '100%',
        top: '0px',
      },
      caption: {
        fontFamily: 'Roboto Mono, monospace',
        letterSpacing: '-0.5px',
        order: 3,
        color: disabled,
      },
      input: {
        order: 2,
        width: '60px',
        padding: `0 ${md} 0 0`,
      },
      actions: {
        order: 4,
        color: disabled,
      },
    },
    MuiTableCell: {
      root: {
        fontFamily: 'Roboto Mono, monospace',
      },
      head: {
        letterSpacing: '1px',
        textTransform: 'uppercase',
        fontWeight: boldFont,
      },
      body: {
        color: primary,
        letterSpacing: '-0.5px',
        fontWeight: 'normal',
      },
    },
    MuiBackdrop: {
      root: {
        backdropFilter: 'blur(1px)',
        backgroundColor: 'rgba(228, 232, 241, 0.75)',
      },
    },
    MuiListItemText: {
      primary: {
        fontFamily: 'Roboto Mono, monospace',
        fontSize: mediumFontSize,
        fontWeight: bolderFont,
        color: primary,
      },
      secondary: {
        fontFamily: 'Roboto Mono, monospace',
        fontSize: smallFontSize,
        color: disabled,
      },
    },
  },
  palette,
})
