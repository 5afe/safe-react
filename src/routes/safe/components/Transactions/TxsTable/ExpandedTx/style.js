// @flow
import {
  md, lg, connected, error, disabled, border,
} from '~/theme/variables'

export const styles = () => ({
  expandedTxBlock: {
    borderBottom: `2px solid ${border}`,
  },
  txDataContainer: {
    padding: `${lg} ${md}`,
  },
  awaiting_your_confirmation: {
    color: disabled,
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
