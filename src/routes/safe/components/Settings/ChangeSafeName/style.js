// @flow
import { lg, sm, boldFont } from '~/theme/variables'

export const styles = () => ({
  formContainer: {
    padding: lg,
    minHeight: '369px',
  },
  root: {
    display: 'flex',
    maxWidth: '460px',
  },
  saveBtn: {
    marginRight: sm,
    fontWeight: boldFont,
  },
})
