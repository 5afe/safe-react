// @flow
import { lg, md, sm, error } from '~/theme/variables'

export const styles = () => ({
  heading: {
    padding: lg,
    justifyContent: 'space-between',
    boxSizing: 'border-box',
  },
  manage: {
    fontSize: lg,
  },
  container: {
    padding: `${md} ${lg}`,
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
  smallerModalWindow: {
    height: 'auto',
    position: 'static',
  },
})
