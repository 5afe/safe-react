// @flow
import {
  md, lg, connected, error,
} from '~/theme/variables'

export const styles = () => ({
  txDataContainer: {
    padding: `${lg} ${md}`,
  },
  rightCol: {
    boxSizing: 'border-box',
    borderLeft: 'solid 1px #c8ced4',
  },
  awaiting_confirmations: {
    color: '#2e73d9',
  },
  awaiting_execution: {
    color: '#2e73d9',
  },
  success: {
    color: connected,
  },
  cancelled: {
    color: error,
  },
})
