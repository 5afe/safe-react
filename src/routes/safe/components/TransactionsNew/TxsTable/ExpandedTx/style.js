// @flow
import { md, lg, connected, error } from '~/theme/variables'

export const styles = () => ({
  txDataContainer: {
    padding: `${lg} ${md}`,
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
