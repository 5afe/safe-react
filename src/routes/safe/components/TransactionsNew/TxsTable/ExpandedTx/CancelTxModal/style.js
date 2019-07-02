// @flow
import { lg, md, sm } from '~/theme/variables'

export const styles = () => ({
  heading: {
    padding: `${sm} ${lg}`,
    justifyContent: 'space-between',
    boxSizing: 'border-box',
    maxHeight: '75px',
  },
  headingText: {
    fontSize: '24px',
  },
  closeIcon: {
    height: '35px',
    width: '35px',
  },
  container: {
    padding: `${md} ${lg}`,
  },
  buttonRow: {
    height: '84px',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  smallerModalWindow: {
    height: 'auto',
    position: 'static',
  },
})
