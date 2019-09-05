// @flow
import {
  sm, lg, border, secondary, bolderFont, background,
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
    borderRight: `solid 1px ${border}`,
    height: '100%',
  },
  menuOption: {
    padding: lg,
    alignItems: 'center',
    cursor: 'pointer',
  },
  active: {
    backgroundColor: background,
    color: secondary,
    fontWeight: bolderFont,
  },
  container: {
    height: '100%',
  },
  message: {
    margin: `${sm} 0`,
  },
  links: {
    textDecoration: 'underline',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  removeSafeText: {
    height: '16px',
    lineHeight: '16px',
    paddingRight: sm,
    float: 'left',
  },
  removeSafeIcon: {
    height: '16px',
    cursor: 'pointer',
  },
})
