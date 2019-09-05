// @flow
import { lg, sm, boldFont, border } from '~/theme/variables'

export const styles = () => ({
  formContainer: {
    padding: lg,
  },
  root: {
    display: 'flex',
    maxWidth: '460px',
  },
  saveBtn: {
    marginRight: sm,
    fontWeight: boldFont,
    boxShadow: '1px 2px 10px 0 rgba(212, 212, 211, 0.59)',
  },
  controlsRow: {
    padding: lg,
    position: 'absolute',
    bottom: 0,
    boxSizing: 'border-box',
    width: '100%',
    borderTop: `2px solid ${border}`,
  },
})
