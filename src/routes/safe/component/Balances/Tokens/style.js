// @flow
import { lg, sm } from '~/theme/variables'

export const styles = () => ({
  heading: {
    padding: `${sm} ${lg}`,
    justifyContent: 'space-between',
    maxHeight: '75px',
    boxSizing: 'border-box',
  },
  manage: {
    fontSize: '24px',
  },
  close: {
    height: '35px',
    width: '35px',
  },
})
