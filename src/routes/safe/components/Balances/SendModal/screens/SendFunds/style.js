// @flow
import { lg, md, sm } from '~/theme/variables'

export const styles = () => ({
  heading: {
    padding: `${sm} ${lg}`,
    justifyContent: 'space-between',
    boxSizing: 'border-box',
    maxHeight: '75px',
  },
  manage: {
    fontSize: '24px',
  },
  closeIcon: {
    height: '35px',
    width: '35px',
  },
  formContainer: {
    padding: `${md} ${lg}`,
  },
})
