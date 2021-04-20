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
  },
  buttonEdit: {
    color: '#fff',
    backgroundColor: error,
  },
  saveButton: {
    marginLeft: '16px',
  },
  open: {
    paddingLeft: sm,
    width: 'auto',
    '&:hover': {
      cursor: 'pointer',
    },
  },
})
