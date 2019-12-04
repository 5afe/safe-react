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
  expandedRow: {
    backgroundColor: '#fff3e2',
  },
  cancelledRow: {
    opacity: 0.4,
  },
  extendedTxContainer: {
    padding: 0,
    '&:last-child': {
      padding: 0,
    },
    backgroundColor: '#fffaf4',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
})
