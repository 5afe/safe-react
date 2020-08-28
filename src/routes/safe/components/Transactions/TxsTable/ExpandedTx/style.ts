import { border, connected, disabled, error, lg, md } from 'src/theme/variables'

export const styles = () => ({
  expandedTxBlock: {
    borderBottom: `2px solid ${border}`,
  },
  txDataContainer: {
    padding: `${lg} ${md}`,
  },
  txData: {
    alignItems: 'center',
    display: 'flex',
    lineHeight: '1.6',
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
  incomingTxBlock: {
    borderRight: '2px solid rgb(232, 231, 230)',
  },
  emptyRowDataContainer: {
    paddingTop: lg,
    paddingLeft: md,
    paddingBottom: md,
    borderRight: '2px solid rgb(232, 231, 230)',
  },
})
