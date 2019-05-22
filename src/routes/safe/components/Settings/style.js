// @flow
import { sm, xs } from '~/theme/variables'

export const styles = (theme: Object) => ({
  settings: {
    letterSpacing: '-0.5px',
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
