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
    fontWeight: boldFont,
    marginRight: sm,
  },
  controlsRow: {
    borderTop: `2px solid ${border}`,
    bottom: 0,
    boxSizing: 'border-box',
    padding: lg,
    position: 'absolute',
    width: '100%',
  },
  versionNumber: {
    height: '21px',
  },
})
