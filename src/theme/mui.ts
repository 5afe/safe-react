import { createTheme } from '@material-ui/core/styles'
import { alpha } from '@material-ui/core/styles/colorManipulator'

import {
  alertWarning,
  background,
  boldFont,
  bolderFont,
  border,
  buttonLargeFontSize,
  disabled,
  error,
  extraSmallFontSize,
  fontColor,
  largeFontSize,
  lg,
  mainFontFamily,
  md,
  mediumFontSize,
  primary,
  regularFont,
  secondary,
  secondaryBackground,
  secondaryFontFamily,
  secondaryText,
  sm,
  smallFontSize,
  xs,
  black300,
  black400,
  infoColor,
} from './variables'

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
  success: {
    main: secondary,
  },
  contrastThreshold: 3,
  tonalOffset: 0.2,
}

// see https://material-ui-next.com/customization/themes/
// see https://github.com/mui-org/material-ui/blob/v1-beta/src/styles/createMuiTheme.js
const theme = createTheme({
  typography: {
    fontFamily: mainFontFamily,
    useNextVariants: true,
  },
  overrides: {
    MuiButton: {
      label: {
        lineHeight: '1',
        fontSize: largeFontSize,
        fontWeight: regularFont,
      },
      root: {
        fontFamily: secondaryFontFamily,
        letterSpacing: '0.9px',
        '&$disabled': {
          color: disabled,
        },
        color: disabled,
        textTransform: 'none',
        borderRadius: sm,
      },
      contained: {
        boxShadow: '1px 2px 10px 0 rgba(212, 212, 211, 0.59)',
      },
      containedPrimary: {
        backgroundColor: secondary,
      },
      containedSecondary: {
        backgroundColor: error,
        '&:hover': {
          backgroundColor: '#d4d5d3',
        },
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
        padding: `${lg} 0 0 15px`,
        background: 'transparent',
      },
    },
    MuiIconButton: {
      root: {
        padding: '0',
      },
    },
    MuiChip: {
      root: {
        fontFamily: secondaryFontFamily,
      },
    },
    MuiStepIcon: {
      root: {
        fontSize: '22px',
        color: `${secondaryText} !important`,
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
        borderLeft: `1px solid ${secondaryText}`,
      },
    },
    MuiTypography: {
      body1: {
        fontFamily: secondaryFontFamily,
        letterSpacing: '-0.5px',
        fontSize: mediumFontSize,
      },
      body2: {
        fontFamily: secondaryFontFamily,
      },
    },
    MuiFormControl: {
      root: {
        width: '100%',
      },
    },
    MuiInput: {
      root: {
        backgroundColor: secondaryBackground,
        borderRadius: '5px',
        color: primary,
        fontFamily: secondaryFontFamily,
        fontSize: mediumFontSize,
        lineHeight: '56px',
        order: '1',
        padding: `0 ${md}`,
        '&:$disabled': {
          color: '#0000ff',
        },
        '&:active': {
          borderBottomLeftRadius: '0',
          borderBottomRightRadius: '0',
        },
      },
      input: {
        color: primary,
        display: 'flex',
        height: 'auto',
        letterSpacing: '0.5px',
        padding: '0',
        textOverflow: 'ellipsis',
        '&::-webkit-input-placeholder': {
          color: disabled,
        },
      },
      underline: {
        '&::before': {
          visibility: 'hidden',
          borderBottomColor: secondary,
          borderBottomStyle: 'solid',
          borderBottomWidth: '2px !important',
        },
        // after pseudo element in the underline is used for the focus border
        '&::after': {
          borderBottomColor: secondary,
          borderBottomStyle: 'solid',
          borderBottomWidth: '2px !important',
        },
        '&.isValid::before': {
          visibility: 'visible',
          borderBottomColor: `${secondary} !important`,
        },
        '&.isInvalid::after': {
          borderBottomColor: `${error} !important`,
        },
        '&.isValid::after': {
          display: 'none',
        },
        '&:focus': {
          visibility: 'visible',
        },
        '&:hover': {
          visibility: 'visible',
        },
      },
      formControl: {
        marginTop: '0 !important',
      },
    },
    MuiInputLabel: {
      outlined: {
        '&$error': {
          color: error,
        },
      },
    },
    MuiOutlinedInput: {
      root: {
        padding: 0,
        borderRadius: xs,
        color: primary,
        fontFamily: secondaryFontFamily,
        fontSize: largeFontSize,
        '&:$disabled': {
          color: '#0000ff',
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: black300,
          transition: 'borderColor 0.2s ease-in-out 0s',
          borderWidth: '1px',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: secondary,
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: black400,
          borderWidth: '1px',
        },
        '&.Mui-error .MuiOutlinedInput-notchedOutline': {
          borderColor: error,
        },
      },
      input: {
        color: primary,
        display: 'flex',
        height: 'auto',
        padding: md,
        lineHeight: '1.5',
        textOverflow: 'ellipsis',
        '&::-webkit-input-placeholder': {
          color: disabled,
        },
      },
      adornedEnd: {
        paddingRight: md,
      },
    },
    MuiAutocomplete: {
      inputRoot: {
        padding: '0px !important',
      },
      input: {
        padding: '16px !important',
      },
    },
    MuiSelect: {
      outlined: {
        padding: '8px 16px',
        minHeight: '56px !important',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
      },
    },
    MuiFilledInput: {
      underline: {
        '&::before': {
          borderBottomStyle: 'solid',
          borderBottomWidth: '2px !important',
        },
        '&::after': {
          borderBottomStyle: 'solid',
          borderBottomWidth: '2px !important',
        },
        '&.isValid::before': {
          borderBottomColor: `${secondary} !important`,
        },
        '&.isInvalid::after': {
          borderBottomColor: `${error} !important`,
        },
        '&.isValid::after': {
          display: 'none',
        },
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
    MuiSvgIcon: {
      colorSecondary: {
        color: secondaryText,
      },
    },
    MuiTab: {
      root: {
        fontFamily: secondaryFontFamily,
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
    MuiTableContainer: {
      root: {
        marginLeft: '-10px',
        marginRight: '-10px',
        marginTop: '-10px',
        paddingLeft: '10px',
        paddingRight: '10px',
        paddingTop: '10px',
      },
    },
    MuiTablePagination: {
      toolbar: {
        paddingRight: '15px',
        '& > span:nth-child(2)': {
          order: 1,
        },
      },
      selectIcon: {
        height: '100%',
        top: '0px',
      },
      caption: {
        color: disabled,
        fontFamily: secondaryFontFamily,
        fontSize: mediumFontSize,
        order: '2',
      },
      input: {
        color: disabled,
        order: '2',
        width: '60px',
      },
      select: {
        minWidth: lg,
        paddingRight: '30',
      },
      actions: {
        color: disabled,
        order: '4',
      },
    },
    MuiTableSortLabel: {
      root: {
        fontSize: extraSmallFontSize,
      },
      active: {
        fontWeight: boldFont,
      },
    },
    MuiTableCell: {
      root: {
        borderBottomWidth: '2px',
        fontFamily: secondaryFontFamily,
        fontSize: mediumFontSize,
      },
      head: {
        letterSpacing: '1px',
        textTransform: 'uppercase',
      },
      body: {
        color: primary,
        fontWeight: 'normal',
        letterSpacing: 'normal',
        overflow: 'hidden',
        paddingBottom: xs,
        paddingTop: xs,
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
    },
    MuiBackdrop: {
      root: {
        backdropFilter: 'blur(1px)',
        backgroundColor: 'rgba(228, 232, 241, 0.75)',
        top: '52px',
      },
    },
    MuiMenuItem: {
      root: {
        fontFamily: secondaryFontFamily,
      },
    },
    MuiListItemIcon: {
      root: {
        minWidth: 'auto',
      },
    },
    MuiListItemText: {
      primary: {
        color: primary,
        fontFamily: secondaryFontFamily,
        fontSize: mediumFontSize,
        fontWeight: bolderFont,
      },
      secondary: {
        color: disabled,
        fontFamily: secondaryFontFamily,
        fontSize: smallFontSize,
      },
    },
    MuiCheckbox: {
      colorSecondary: {
        '&$disabled': {
          color: alpha(secondary, 0.5),
        },
      },
    },
    MuiFormLabel: {
      root: {
        '&$focused': {
          color: black400,
        },
      },
    },
    MuiFormControlLabel: {
      label: {
        '&$disabled': {
          color: primary,
        },
      },
    },
    MuiAlert: {
      root: {
        color: fontColor,
        alignItems: 'center',
      },
      standardWarning: {
        backgroundColor: alertWarning,
      },
      standardInfo: {
        backgroundColor: infoColor,
        borderRadius: '8px',
        '& svg': {
          color: secondary,
        },
      },
      icon: {
        '& > svg': {
          width: md,
          height: md,
        },
      },
    },
    MuiAlertTitle: {
      root: {
        color: fontColor,
        fontSize: md,
        margin: 0,
      },
    },
  },
  palette,
} as any)

export default theme

export const DropdownListTheme = {
  ...theme,
  overrides: {
    ...theme.overrides,
    MuiPaper: {
      root: {
        marginTop: '10px',
      },
      elevation0: {
        boxShadow: '1px 2px 10px 0 rgba(212, 212, 211, 0.59)',
      },
      rounded: {
        borderRadius: xs,
      },
    },
    MuiList: {
      padding: {
        paddingBottom: '0',
        paddingTop: '0',
      },
    },
    MuiListItem: {
      root: {
        borderBottom: `2px solid ${border}`,
        '&:last-child': {
          borderBottom: 'none',
        },
        boxSizing: 'border-box',
      },
      button: {
        '&:hover': {
          backgroundColor: `${background}`,
        },
      },
    },
  },
}
