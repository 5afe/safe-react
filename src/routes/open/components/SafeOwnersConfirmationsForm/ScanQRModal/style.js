// @flow
import { lg, sm, background } from '~/theme/variables'

export const styles = () => ({
  heading: {
    padding: `${sm} ${lg}`,
    justifyContent: 'space-between',
    maxHeight: '75px',
    boxSizing: 'border-box',
  },
  loaderContainer: {
    width: '100%',
    height: '100%',
  },
  manage: {
    fontSize: '24px',
  },
  close: {
    height: '35px',
    width: '35px',
  },
  detailsContainer: {
    backgroundColor: background,
    maxHeight: '420px',
  },
  buttonRow: {
    height: '84px',
    justifyContent: 'center',
  },
  button: {
    '&:last-child': {
      marginLeft: sm,
    },
  },
})