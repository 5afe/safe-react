// @flow
import {
  smallFontSize, boldFont, sm, error, disabled, primary,
} from '~/theme/variables'

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
    backgroundColor: '#A1D2CA',
    color: primary,
  },
  cancelled: {
    backgroundColor: 'transparent',
    color: error,
  },
  awaiting_confirmations: {
    backgroundColor: '#dfebff',
    color: disabled,
  },
  awaiting_execution: {
    backgroundColor: '#dfebff',
    color: disabled,
  },
  pending: {
    backgroundColor: '#fff3e2',
    color: '#e8673c',
  },
  statusText: {
    marginLeft: 'auto',
    textTransform: 'uppercase',
  },
})
