// @flow
import {
  boldFont, sm, lg, error, disabled, extraSmallFontSize, secondary,
} from '~/theme/variables'

export const styles = () => ({
  container: {
    display: 'flex',
    fontSize: extraSmallFontSize,
    fontWeight: boldFont,
    padding: sm,
    alignItems: 'center',
    boxSizing: 'border-box',
    height: lg,
    marginTop: sm,
    marginBottom: sm,
    borderRadius: '3px',
  },
  success: {
    backgroundColor: '#A1D2CA',
    color: secondary,
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
    width: '84px',
  },
  statusText: {
    width: '100%',
    textAlign: 'center',
  },
})
