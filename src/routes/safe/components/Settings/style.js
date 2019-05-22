// @flow
import {
  sm, md, lg, border,
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
  container: {
    padding: lg,
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
