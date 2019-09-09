// @flow
import {
  sm, md, lg, border, secondary, bolderFont, background, largeFontSize,
} from '~/theme/variables'

export const styles = () => ({
  root: {
    backgroundColor: 'white',
    boxShadow: '1px 2px 10px 0 rgba(212, 212, 211, 0.59)',
    minHeight: '505px',
    display: 'flex',
    borderRadius: '8px',
  },
  settings: {
    letterSpacing: '-0.5px',
  },
  menu: {
    borderRight: `solid 2px ${border}`,
    height: '100%',
  },
  menuOption: {
    fontSize: largeFontSize,
    padding: `${md} 0 ${md} ${lg}`,
    alignItems: 'center',
    cursor: 'pointer',
    '&:first-child': {
      borderRadius: '8px',
    },
  },
  active: {
    backgroundColor: background,
    color: secondary,
    fontWeight: bolderFont,
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
    height: '16px',
    cursor: 'pointer',
  },
})
