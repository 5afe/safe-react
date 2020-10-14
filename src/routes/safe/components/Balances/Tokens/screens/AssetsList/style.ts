import { createStyles, makeStyles } from '@material-ui/core'

import { md, mediumFontSize, secondaryText, sm, xs } from 'src/theme/variables'

export const useStyles = makeStyles(
  createStyles({
    root: {
      minHeight: '52px',
    },
    search: {
      color: secondaryText,
      paddingLeft: sm,
    },
    padding: {
      padding: `0 ${md}`,
    },
    add: {
      fontSize: '11px',
      fontWeight: 'normal',
      paddingRight: md,
      paddingLeft: md,
    },
    addBtnLabel: {
      fontSize: mediumFontSize,
    },
    actions: {
      height: '50px',
    },
    list: {
      overflow: 'hidden',
      overflowY: 'scroll',
      padding: 0,
      height: '100%',
    },
    tokenIcon: {
      marginRight: sm,
      height: '28px',
      width: '28px',
    },
    searchInput: {
      backgroundColor: 'transparent',
      lineHeight: 'initial',
      fontSize: '13px',
      padding: 0,
      '& > input::placeholder': {
        letterSpacing: '-0.5px',
        fontSize: mediumFontSize,
        color: 'black',
      },
      '& > input': {
        letterSpacing: '-0.5px',
      },
    },
    progressContainer: {
      width: '100%',
      height: '100%',
      alignItems: 'center',
    },
    searchContainer: {
      width: '180px',
      marginLeft: xs,
      marginRight: xs,
    },
    searchRoot: {
      letterSpacing: '-0.5px',
      fontSize: '13px',
      border: 'none',
      boxShadow: 'none',
      '& > button': {
        display: 'none',
      },
    },
    searchIcon: {
      '&:hover': {
        backgroundColor: 'transparent !important',
      },
    },
  }),
)
