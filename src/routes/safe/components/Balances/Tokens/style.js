// @flow
import { lg, md } from '~/theme/variables'

export const styles = () => ({
  heading: {
    padding: `${md} ${lg}`,
    justifyContent: 'space-between',
    maxHeight: '75px',
    boxSizing: 'border-box',
  },
  close: {
    height: '35px',
    width: '35px',
  },
})
