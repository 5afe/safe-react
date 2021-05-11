import { error, lg, md, sm } from 'src/theme/variables'
import { createStyles } from '@material-ui/core'

export const styles = createStyles({
  heading: {
    padding: lg,
    justifyContent: 'space-between',
    boxSizing: 'border-box',
    height: '74px',
  },
  manage: {
    fontSize: lg,
  },
  container: {
    padding: `${md} ${lg}`,
    minHeight: '200px',
  },
  close: {
    height: '35px',
    width: '35px',
  },
  buttonRow: {
    height: '84px',
    justifyContent: 'center',
    gap: '16px',
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
