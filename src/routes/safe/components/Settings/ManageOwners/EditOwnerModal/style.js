// @flow
import {
  lg, md, sm, error, background,
} from '~/theme/variables'

export const styles = (theme: Object) => ({
  heading: {
    padding: `${sm} ${lg}`,
    justifyContent: 'space-between',
    maxHeight: '75px',
    boxSizing: 'border-box',
  },
  manage: {
    fontSize: '24px',
  },
  container: {
    padding: `${md} ${lg}`,
    paddingBottom: '40px',
  },
  close: {
    height: '35px',
    width: '35px',
  },
  buttonRow: {
    height: '84px',
    justifyContent: 'center',
  },
  buttonEdit: {
    color: '#fff',
    backgroundColor: error,
  },
  open: {
    paddingLeft: sm,
    width: 'auto',
    '&:hover': {
      cursor: 'pointer',
    },
  },
})
