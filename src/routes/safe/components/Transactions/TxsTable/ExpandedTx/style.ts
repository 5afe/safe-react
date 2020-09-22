import { border, lg, md } from 'src/theme/variables'

const cssStyles = {
  col: {
    wordBreak: 'break-word',
    whiteSpace: 'normal',
  },
  expandedTxBlock: {
    borderBottom: `2px solid ${border}`,
  },
  txDataContainer: {
    padding: `${lg} ${md}`,
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
}

export const styles = (): typeof cssStyles => cssStyles
