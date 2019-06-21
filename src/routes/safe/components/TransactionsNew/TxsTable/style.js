// @flow
import { lg } from '~/theme/variables'

export const styles = () => ({
  container: {
    marginTop: lg,
  },
  row: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#fff3e2',
    },
  },
  extendedTxContainer: {
    padding: 0,
  },
})
