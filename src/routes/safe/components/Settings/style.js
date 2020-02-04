// @flow
import {
  xs, sm, md, border, secondary, bolderFont, background, largeFontSize, fontColor,
} from '~/theme/variables'

export const styles = () => ({
  root: {
    backgroundColor: 'white',
    boxShadow: '1px 2px 10px 0 rgba(212, 212, 211, 0.59)',
    minHeight: '505px',
    marginBottom: '54px',
    display: 'flex',
    borderRadius: sm,
  },
  settings: {
    letterSpacing: '-0.5px',
  },
  menu: {
    borderRight: `solid 2px ${border}`,
    height: '100%',
  },
  menuOption: {
    alignItems: 'center',
    cursor: 'pointer',
    fontSize: largeFontSize,
    lineHeight: '1.2',
    padding: `${md} 0 ${md} ${md}`,
    '&:first-child': {
      borderTopLeftRadius: sm,
    },
    '& svg': {
      display: 'block',
      marginRight: sm,
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
  container: {
    height: '100%',
    position: 'relative',
  },
  message: {
    margin: `${sm} 0`,
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
    marginLeft: 'auto',
    marginRight: sm,
    padding: xs,
  },
})
