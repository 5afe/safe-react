// @flow
import {
  lg, sm, boldFont, border,
} from '~/theme/variables'

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
  },
  controlsRow: {
    padding: lg,
    position: 'absolute',
    bottom: 0,
    boxSizing: 'border-box',
    width: '100%',
    borderTop: `2px solid ${border}`,
  },
  versionNumber: {
    height: '21px',
  },
})
