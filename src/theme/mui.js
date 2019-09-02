// @flow
import { createMuiTheme } from '@material-ui/core/styles'
import {
  extraSmallFontSize,
  mediumFontSize,
  smallFontSize,
  disabled,
  primary,
  secondary,
  error,
  sm,
  md,
  lg,
  bolderFont,
  regularFont,
  boldFont,
  buttonLargeFontSize,
  border,
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
    fontFamily: 'Averta,sans-serif',
    useNextVariants: true,
  },
  overrides: {
    MuiButton: {
      label: {
        lineHeight: 1,
        fontWeight: regularFont,
      },
      root: {
        fontFamily: 'Averta, monospace',
        letterSpacing: '0.9px',
        '&$disabled': {
          color: disabled,
        },
        color: disabled,
        textTransform: 'none',
        borderRadius: '8px',
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
      outlinedPrimary: {
        border: `2px solid ${primary}`,
        '&:hover': {
          border: `2px solid ${primary}`,
        },
      },
      sizeLarge: {
        padding: `${md} ${lg}`,
        minHeight: '52px',
        fontSize: buttonLargeFontSize,
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
    MuiPaper: {
      rounded: {
        borderRadius: sm,
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
        fontFamily: 'Averta, monospace',
      },
    },
    MuiStepIcon: {
      root: {
        fontSize: '22px',
        color: '#B2B5B2 !important',
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
        borderLeft: '1px solid #B2B5B2',
      },
    },
    MuiTypography: {
      body1: {
        fontFamily: 'Averta, monospace',
        letterSpacing: '-0.5px',
        fontSize: mediumFontSize,
      },
      body2: {
        fontFamily: 'Averta, monospace',
      },
    },
    MuiFormHelperText: {
      root: {
        fontFamily: 'Averta, monospace',
        fontSize: '12px',
        padding: `0 0 0 ${md}`,
        position: 'absolute',
        top: '5px',
        color: secondary,
        order: 0,
        marginTop: '0px',
        backgroundColor: border,
        zIndex: 1, // for firefox
      },
    },
    MuiInput: {
      root: {
        fontFamily: 'Averta, monospace',
        color: primary,
        fontSize: mediumFontSize,
        lineHeight: '56px',
        order: 1,
        padding: `0 ${md}`,
        backgroundColor: '#F0EFEE',
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
        color: secondary,
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
        fontFamily: 'Averta, monospace',
        fontWeight: 'normal',
        fontSize: extraSmallFontSize,
        '&$selected': {
          fontWeight: boldFont,
        },
        '@media (min-width: 960px)': {
          fontSize: extraSmallFontSize, // override material-ui media query
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
        fontFamily: 'Averta, monospace',
        fontSize: mediumFontSize,
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
    MuiTableSortLabel: {
      root: {
        fontSize: extraSmallFontSize,
      },
    },
    MuiTableCell: {
      root: {
        fontFamily: 'Averta, monospace',
        fontSize: mediumFontSize,
        borderBottomWidth: '2px',
      },
      head: {
        letterSpacing: '1px',
        textTransform: 'uppercase',
        fontWeight: boldFont,
      },
      body: {
        color: primary,
        letterSpacing: 'normal',
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
        fontFamily: 'Averta, monospace',
      },
    },
    MuiListItemIcon: {
      root: {
        minWidth: 'auto',
      },
    },
    MuiListItemText: {
      primary: {
        fontFamily: 'Averta, monospace',
        fontSize: mediumFontSize,
        fontWeight: bolderFont,
        color: primary,
      },
      secondary: {
        fontFamily: 'Averta, monospace',
        fontSize: smallFontSize,
        color: disabled,
      },
    },
  },
  palette,
})
