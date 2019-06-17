// @flow
import {
  sm, md, lg, border, secondary, bolderFont,
} from '~/theme/variables'

export const styles = (theme: Object) => ({
  root: {
    backgroundColor: 'white',
    boxShadow: '0 -1px 4px 0 rgba(74, 85, 121, 0.5)',
    minHeight: '400px',
    display: 'flex',
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
    backgroundColor: '#f4f4f9',
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
})
