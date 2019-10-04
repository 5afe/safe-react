// @flow
import {
  md, lg, connected, error, disabled,
} from '~/theme/variables'

export const styles = () => ({
  txDataContainer: {
    padding: `${lg} ${md}`,
  },
  awaiting_confirmations: {
    color: disabled,
  },
  awaiting_execution: {
    color: disabled,
  },
  success: {
    color: connected,
  },
  cancelled: {
    color: error,
  },
  txHash: {
    paddingRight: '3px',
  },
})
