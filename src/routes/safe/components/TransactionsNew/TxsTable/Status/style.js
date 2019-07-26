// @flow
import { smallFontSize, boldFont, sm } from '~/theme/variables'

export const styles = () => ({
  container: {
    display: 'flex',
    fontSize: smallFontSize,
    fontWeight: boldFont,
    width: '100px',
    padding: sm,
    alignItems: 'center',
    boxSizing: 'border-box',
  },
  success: {
    backgroundColor: '#d7f3f3',
    color: '#346d6d',
  },
  cancelled: {
    backgroundColor: 'transparent',
    color: '#fd7890',
  },
  awaiting_confirmations: {
    backgroundColor: '#dfebff',
    color: '#2e73d9',
  },
  awaiting_execution: {
    backgroundColor: '#dfebff',
    color: '#2e73d9',
  },
  statusText: {
    marginLeft: 'auto',
    textTransform: 'uppercase',
  },
})
