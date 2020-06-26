import { createStyles } from '@material-ui/core'

import {
  background,
  bolderFont,
  border,
  fontColor,
  largeFontSize,
  md,
  screenSm,
  secondary,
  sm,
  xs,
} from 'src/theme/variables'

export const styles = createStyles({
  root: {
    backgroundColor: 'white',
    borderRadius: sm,
    boxShadow: '1px 2px 10px 0 rgba(212, 212, 211, 0.59)',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '54px',
    minHeight: '505px',

    [`@media (min-width: ${screenSm}px)`]: {
      flexDirection: 'row',
    },
  },
  settings: {
    letterSpacing: '-0.5px',
  },
  menuWrapper: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 0,
    maxWidth: '100%',

    [`@media (min-width: ${screenSm}px)`]: {
      flexDirection: 'row',
      maxWidth: 'unset',
    },
  },
  menu: {
    borderBottom: `solid 2px ${border}`,
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
    height: '100%',
    width: '100%',

    [`@media (min-width: ${screenSm}px)`]: {
      borderBottom: 'none',
      borderRight: `solid 2px ${border}`,
      flexDirection: 'column',
      width: '250px',
    },
  },
  menuOption: {
    alignItems: 'center',
    borderRight: `solid 1px ${border}`,
    boxSizing: 'border-box',
    cursor: 'pointer',
    flexGrow: 1,
    flexShrink: 1,
    fontSize: '13px',
    justifyContent: 'center',
    lineHeight: '1.2',
    minWidth: '0',
    padding: `${md} ${sm}`,
    width: '100%',

    [`@media (min-width: ${screenSm}px)`]: {
      borderRight: 'none',
      flexGrow: '0',
      fontSize: largeFontSize,
      justifyContent: 'flex-start',
      padding: `${md} 0 ${md} ${md}`,
    },
    '&:last-of-type': {
      borderRight: 'none',
    },
    '&:first-child': {
      borderTopLeftRadius: sm,
    },
    '& svg': {
      display: 'block',
      marginRight: xs,
      maxWidth: '16px',

      [`@media (min-width: ${screenSm}px)`]: {
        marginRight: sm,
      },
    },
    '& .fill': {
      fill: fontColor,
    },
  },
  active: {
    backgroundColor: background,
    color: secondary,
    fontWeight: bolderFont,
    '& .fill': {
      fill: secondary,
    },
  },
  contents: {
    width: '100%',
  },
  hairline: {
    display: 'none',

    [`@media (min-width: ${screenSm}px)`]: {
      display: 'block',
    },
  },
  container: {
    flexGrow: 1,
    height: '100%',
    position: 'relative',
  },
  message: {
    padding: `${md} 0`,
    maxHeight: '54px', // to make it the same as row in Balances component
    boxSizing: 'border-box',
    justifyContent: 'flex-end',
  },
  links: {
    textDecoration: 'underline',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  removeSafeBtn: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '-1px', // to make it the same as row in Balances component
  },
  removeSafeIcon: {
    marginLeft: sm,
    height: md,
    cursor: 'pointer',
  },
  counter: {
    background: border,
    borderRadius: '3px',
    color: fontColor,
    lineHeight: 'normal',
    margin: `-2px 0 -2px ${sm}`,
    padding: xs,
    fontSize: '11px',
  },
})
