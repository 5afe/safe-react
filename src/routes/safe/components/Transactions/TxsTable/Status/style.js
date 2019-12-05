// @flow
import {
  boldFont, sm, error, disabled,
} from '~/theme/variables'

export const styles = () => ({
  container: {
    display: 'flex',
    fontSize: '11px',
    fontWeight: boldFont,
    // width: '100px',
    padding: sm,
    alignItems: 'center',
    boxSizing: 'border-box',
    height: '24px',
    marginTop: '8px',
    marginBottom: '8px',
    borderRadius: '3px',
  },
  success: {
    backgroundColor: '#A1D2CA',
    color: '#008c73',
    width: '84px',
  },
  cancelled: {
    backgroundColor: 'transparent',
    color: error,
    border: `1px solid ${error}`,
    width: '84px',
  },
  awaiting_your_confirmation: {
    backgroundColor: '#d4d5d3',
    color: disabled,
    width: '175px',
  },
  awaiting_confirmations: {
    backgroundColor: '#d4d5d3',
    color: disabled,
    width: '160px',
  },
  awaiting_execution: {
    backgroundColor: '#d4d5d3',
    color: disabled,
    width: '133px',
  },
  pending: {
    backgroundColor: '#fff3e2',
    color: '#e8673c',
  },
  statusText: {
    width: '100%',
    textAlign: 'center',
  },
})
