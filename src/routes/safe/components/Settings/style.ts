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
  links: {
    textDecoration: 'underline',
    marginRight: '6px',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  removeSafeBtn: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '-1px', // to make it the same as row in Balances component
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
