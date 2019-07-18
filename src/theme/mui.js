// @flow
import { createMuiTheme } from '@material-ui/core/styles'
import {
  largeFontSize,
  mediumFontSize,
  smallFontSize,
  disabled,
  primary,
  secondary,
  error,
  md,
  lg,
  bolderFont,
  boldFont,
  buttonLargeFontSize,
  xs,
} from './variables'

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
  error: {
    main: error,
  },
  contrastThreshold: 3,
  tonalOffset: 0.2,
}

// see https://material-ui-next.com/customization/themes/
// see https://github.com/mui-org/material-ui/blob/v1-beta/src/styles/createMuiTheme.js
export default createMuiTheme({
  typography: {
    fontFamily: 'Montserrat,sans-serif',
    useNextVariants: true,
  },
  overrides: {
    MuiButton: {
      label: {
        lineHeight: 1,
      },
      root: {
        fontFamily: 'Roboto Mono, monospace',
        letterSpacing: '0.9px',
        '&$disabled': {
          color: disabled,
        },
        color: disabled,
      },
      contained: {
        boxShadow: 'none',
      },
      containedPrimary: {
        backgroundColor: secondary,
      },
      containedSecondary: {
        backgroundColor: error,
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
      textSecondary: {
        '&:hover': {
          borderRadius: '3px',
        },
      },
    },
    MuiStepper: {
      root: {
        padding: '24px 0 0 15px',
      },
    },
    MuiIconButton: {
      root: {
        padding: 0,
      },
    },
    MuiChip: {
      root: {
        fontFamily: 'Roboto Mono, monospace',
      },
    },
    MuiStepIcon: {
      root: {
        fontSize: '22px',
        color: '#A2A8BA !important',
      },
      completed: {
        color: `${secondary} !important`,
      },
      active: {
        color: `${secondary} !important`,
        fontWeight: boldFont,
      },
    },
    MuiStepContent: {
      root: {
        borderLeft: '1px solid #A2A8BA',
      },
    },
    MuiTypography: {
      body1: {
        fontFamily: 'Roboto Mono, monospace',
        letterSpacing: '-0.5px',
        fontSize: mediumFontSize,
      },
      body2: {
        fontFamily: 'Roboto Mono, monospace',
      },
    },
    MuiFormHelperText: {
      root: {
        fontFamily: 'Roboto Mono, monospace',
        fontSize: '12px',
        padding: `0 0 0 ${md}`,
        position: 'absolute',
        top: '5px',
        color: secondary,
        order: 0,
        marginTop: '0px',
        backgroundColor: '#EAE9EF',
        zIndex: 1, // for firefox
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
        backgroundColor: '#EAE9EF',
        borderRadius: '5px',
        '&:$disabled': {
          color: '#0000ff',
        },
      },
      input: {
        padding: 0,
        letterSpacing: '0.5px',
        color: primary,
        height: 'auto',
        textOverflow: 'ellipsis',
        display: 'flex',
        '&::-webkit-input-placeholder': {
          color: disabled,
        },
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
        color: '#A2A8BA',
        '&$active': {
          color: primary,
        },
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
        '&$selected': {
          fontWeight: bolderFont,
        },
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
        paddingTop: xs,
        paddingBottom: xs,
      },
    },
    MuiBackdrop: {
      root: {
        backdropFilter: 'blur(1px)',
        backgroundColor: 'rgba(228, 232, 241, 0.75)',
      },
    },
    MuiMenuItem: {
      root: {
        fontFamily: 'Roboto Mono, monospace',
      },
    },
    MuiListItemIcon: {
      root: {
        minWidth: 'auto',
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
